# Phase 0 Research: Jogo de Vestir Avatares

Todas as marcações `NEEDS CLARIFICATION` do Technical Context foram resolvidas abaixo — não havia ambiguidade de produto pendente (já tratada em `/speckit-clarify`), apenas decisões técnicas de implementação.

## 1. Framework de UI e build tool

- **Decision**: React 18 + TypeScript, com Vite como build tool/dev server.
- **Rationale**: A feature é essencialmente uma árvore de componentes interativos (avatar + seletores por categoria) com estado local raso — um caso de uso clássico para uma biblioteca de componentes como React. Vite oferece dev server rápido com hot reload, build de produção simples (saída estática) e configuração mínima, adequado para uma SPA sem backend.
- **Alternatives considered**:
  - **Vue 3**: igualmente adequado, mas React foi preferido por maior familiaridade/ecossistema de testes (React Testing Library) e por ser o padrão mais comum em projetos novos.
  - **HTML/CSS/JS puro (sem framework)**: reduziria dependências, mas tornaria a re-renderização das camadas de roupa e a árvore de estado (pele, cabelo, 6 slots) mais trabalhosa de manter conforme o catálogo cresce; componentização paga-se rápido aqui.
  - **Next.js/Remix (meta-frameworks)**: trazem roteamento/SSR desnecessários para uma SPA de tela única, 100% client-side.

## 2. Persistência do estado do avatar

- **Decision**: `localStorage`, guardando um único objeto JSON serializado sob uma chave de aplicação (ex.: `vestir.avatarState.v1`).
- **Rationale**: Atende FR-008/FR-009 (salvar automaticamente no dispositivo, sem login) com a API mais simples possível; síncrona, suportada em todos os navegadores modernos, e mais que suficiente em capacidade para um estado que guarda apenas identificadores (tom de pele, cabelo, ids de peças por slot), não imagens.
- **Alternatives considered**:
  - **IndexedDB**: mais poderoso (assíncrono, maior limite de armazenamento), mas é excesso de engenharia para um objeto pequeno e simples; adicionaria complexidade de API sem benefício aqui.
  - **Cookies**: limite de tamanho menor e enviados a cada requisição HTTP (irrelevante, já que não há backend) — não fazem sentido para este caso.
  - **Sem persistência (memória apenas)**: rejeitado, pois contraria diretamente FR-008/FR-009/User Story 3.

## 3. Renderização das camadas visuais (avatar + roupas)

- **Decision**: Camadas de imagem posicionadas de forma absoluta (`position: absolute`) dentro de um contêiner relativo (`AvatarStage`), empilhadas por `z-index` fixo por slot (corpo → parte de baixo → parte de cima/vestido → sapato → cabelo → acessório).
- **Rationale**: Como o estilo definido em FR-013 é 2D estático, sem rotação 3D nem composição dinâmica de pixels, empilhar imagens via CSS é a abordagem mais simples, performática (troca de peça = trocar `src`/visibilidade de uma camada, sem re-render de canvas) e fácil de testar (cada camada é um elemento inspecionável no DOM).
- **Alternatives considered**:
  - **`<canvas>` com composição manual**: daria mais controle (ex.: efeitos, máscaras), mas exige lógica de desenho manual e dificulta testes de UI e acessibilidade; desnecessário para arte 2D estática pré-recortada.
  - **Engine 3D (Three.js/Babylon.js)**: rejeitado por FR-013 (estilo 2D "funko/chibi" sem rotação 3D) — adicionaria complexidade e peso de bundle sem necessidade.

## 4. Formato dos assets visuais

- **Decision**: SVG como formato primário para o corpo do avatar e peças de roupa (com PNG como alternativa pontual para ilustrações com textura/gradientes complexos que não valham a pena vetorizar).
- **Rationale**: SVG escala sem perda em qualquer tamanho de tela/zoom (importante em mobile), tem arquivos tipicamente menores que PNG para ilustrações estilo "flat/chibi", e permite recolorir partes (ex.: variações de tom de pele) via CSS/atributos sem precisar de um arquivo por variação, quando o design permitir.
- **Alternatives considered**:
  - **PNG para tudo**: mais simples de produzir a partir de ilustrações pintadas, mas gera mais peso de download e não escala tão bem; adotado apenas como exceção.
  - **Sprite sheet único**: otimização válida para muitos itens pequenos, mas adiada para uma fase de otimização futura — não é um requisito desta feature (catálogo inicial é pequeno, 3–5 itens por categoria).

## 5. Gerência de estado no frontend

- **Decision**: Um único hook/contexto React (`useAvatarStore`) com um reducer local, sem biblioteca de estado externa.
- **Rationale**: O estado é pequeno e raso (tom de pele, cabelo, até 6 slots de roupa) e usado por poucos componentes; Context + `useReducer` do próprio React é suficiente e evita uma dependência extra.
- **Alternatives considered**:
  - **Redux/Zustand/Jotai**: trariam boilerplate ou uma API extra sem necessidade real, dado o escopo (nesta versão: um avatar, sem sincronização entre abas ou features futuras que justifiquem).

## 6. Estratégia de testes

- **Decision**: Vitest + React Testing Library para testes unitários (regras de slot: vestido substitui blusa+calça; fallback de storage corrompido) e de integração (selecionar peça → avatar atualiza na tela); Playwright para um teste e2e cobrindo o fluxo ponta a ponta (personalizar avatar, vestir roupas, recarregar página, confirmar que persiste).
- **Rationale**: Vitest integra nativamente com Vite (mesma config/transformações), é rápido e tem API compatível com Jest; React Testing Library incentiva testar pelo comportamento visível ao usuário (o que o avatar mostra), alinhado aos critérios de aceitação da spec. Playwright cobre a User Story 3 (persistência entre "sessões" reais de navegador), que testes de componente isolados não validam sozinhos.
- **Alternatives considered**:
  - **Jest**: exigiria configuração adicional de transformação paralela à do Vite; Vitest evita essa duplicação.
  - **Cypress**: alternativa válida ao Playwright para e2e, mas Playwright tem melhor suporte a múltiplos navegadores headless e é mais leve para rodar em CI.

## 7. Estilização

- **Decision**: CSS Modules (arquivos `*.module.css` por componente).
- **Rationale**: Escopo de estilo automático por componente sem precisar de uma biblioteca CSS-in-JS (evita custo de runtime), suportado nativamente pelo Vite, e suficiente para o número pequeno de telas/componentes desta feature.
- **Alternatives considered**:
  - **Tailwind CSS**: produtivo para UIs maiores, mas adicionaria uma dependência/configuração extra sem necessidade clara para uma única tela de personalização; pode ser reavaliado se a UI crescer bastante.
  - **CSS-in-JS (styled-components/emotion)**: custo de runtime e bundle desnecessário para este escopo.

## Resumo das decisões

| Área | Decisão |
|---|---|
| UI/Build | React 18 + TypeScript + Vite |
| Persistência | `localStorage`, objeto JSON versionado |
| Renderização visual | Camadas de imagem via CSS `position: absolute` + `z-index` por slot |
| Formato de asset | SVG (padrão), PNG (exceção pontual) |
| Estado | Context + `useReducer` (sem lib externa) |
| Testes | Vitest + React Testing Library (unit/integration) + Playwright (e2e) |
| Estilo | CSS Modules |
