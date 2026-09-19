# Quickstart: Jogo de Vestir Avatares

Guia para rodar o projeto localmente e validar manualmente que a feature funciona ponta a ponta, seguindo as User Stories de `spec.md`. Não contém código de implementação — apenas comandos e passos de verificação. Os detalhes de schema referenciados estão em `data-model.md` e `contracts/`.

## Pré-requisitos

- Node.js 20+ e npm instalados
- Navegador moderno (Chrome, Firefox, Safari ou Edge recentes)

## Setup

```bash
npm install
npm run dev
```

Abra a URL impressa pelo Vite (tipicamente `http://localhost:5173`).

## Validação manual por User Story

### User Story 1 — Vestir o avatar com roupas (P1)

1. Com o jogo aberto, confirme que o avatar padrão aparece (FR-001), com pele/roupa íntima básica visível em todos os slots (nenhuma roupa vestida ainda).
2. Selecione uma peça na categoria "Blusa" → o avatar deve exibir a blusa imediatamente (FR-004, SC-001: em menos de 2s, na prática quase instantâneo).
3. Selecione uma peça na categoria "Calça" → avatar mostra blusa + calça juntas.
4. Troque a calça por outra peça de "Calça" → a peça anterior é substituída, a blusa permanece (FR-005, SC-004).
5. Selecione um "Vestido" → blusa e calça somem da exibição, só o vestido aparece ocupando as duas partes (FR-007).
6. Volte a selecionar uma "Blusa" → o vestido é removido automaticamente (regra inversa de FR-007).
7. Remova a peça de "Sapato" (ou categoria de sua escolha) → aquele slot volta a mostrar a pele/roupa íntima básica (FR-006).

**Resultado esperado**: em nenhum momento o avatar fica com uma peça de outra categoria alterada sem o jogador pedir (SC-004).

### User Story 2 — Configurar/personalizar o avatar (P2)

1. Abra o painel de personalização de aparência.
2. Escolha um tom de pele diferente → avatar atualiza imediatamente (FR-002).
3. Escolha um estilo/cor de cabelo diferente → avatar atualiza imediatamente.
4. Vá para a tela de roupas e vista uma peça → confirme que pele e cabelo escolhidos continuam aplicados junto com a roupa nova.

### User Story 3 — Continuar de onde parou (P3)

1. Personalize o avatar (pele/cabelo) e vista ao menos 2 peças de categorias diferentes.
2. Recarregue a página (F5) ou feche e reabra a aba.
3. Confirme que o avatar aparece exatamente como estava (mesma pele, cabelo e roupas) — FR-009, SC-003.
4. Em uma aba anônima/outro navegador (sem o `localStorage` local), abra o jogo e confirme que aparece o avatar padrão, sem erro (edge case de dispositivo diferente).
5. Opcional — simular dado corrompido: no DevTools, rode `localStorage.setItem('vestir.avatarState.v1', '{not valid json')`, recarregue a página, e confirme que o jogo abre normalmente com o avatar padrão em vez de travar (FR-010).

## Rodando os testes automatizados

```bash
npm test              # Vitest: unit + integration (regras de slot, componentes)
npm run test:e2e      # Playwright: fluxo completo incluindo persistência entre reloads
```

## Referências

- Regras de negócio e entidades: [data-model.md](./data-model.md)
- Formato salvo em `localStorage`: [contracts/avatar-save-state.schema.json](./contracts/avatar-save-state.schema.json)
- Formato do catálogo de roupas/aparência: [contracts/clothing-catalog.schema.json](./contracts/clothing-catalog.schema.json)
- Decisões técnicas e alternativas consideradas: [research.md](./research.md)
