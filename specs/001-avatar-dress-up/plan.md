# Implementation Plan: Jogo de Vestir Avatares

**Branch**: `001-avatar-dress-up` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-avatar-dress-up/spec.md`

## Summary

Jogo web single-player, sem login, em que o jogador personaliza um avatar (tom de pele, cabelo) e o veste com peças de roupa de categorias fixas (vestido, blusa, calça, short, sapato, acessório), ilustradas em 2D estilo "funko/chibi" e empilhadas visualmente sobre o corpo do avatar. Abordagem técnica: aplicação client-side (React + TypeScript + Vite) sem backend, com estado do avatar guardado em `localStorage` do navegador e um catálogo estático de roupas/opções de aparência versionado no próprio código.

## Technical Context

**Language/Version**: TypeScript 5.x sobre Node.js 20 (build-time); JavaScript ES2022 no navegador (runtime)

**Primary Dependencies**: React 18 (UI/componentes), Vite (build/dev server), CSS Modules (estilos escopados) — sem framework de estado externo (Redux/Zustand não são necessários: um único avatar, estado raso)

**Storage**: `localStorage` do navegador (chave única com o estado serializado do avatar); sem banco de dados nem backend

**Testing**: Vitest + React Testing Library (unit/integration dos componentes e regras de slot), Playwright (e2e do fluxo completo de vestir + persistência entre recarregamentos)

**Target Platform**: Navegador web (desktop e mobile), aplicação estática (SPA) servível por qualquer hospedagem de arquivos estáticos

**Project Type**: web — frontend único (sem projeto de backend, pois não há API nem dados compartilhados entre jogadores)

**Performance Goals**: troca de peça de roupa deve atualizar o avatar em tela em <100ms (bem abaixo do limite de 2s do SC-001), já que é apenas troca de camada de imagem, sem chamadas de rede

**Constraints**: 100% client-side (sem dependência de servidor após o carregamento inicial); deve funcionar offline após o primeiro carregamento; estado salvo deve caber confortavelmente no limite de `localStorage` (tipicamente 5–10MB), já que guarda apenas identificadores de peças/opções, não as imagens

**Scale/Scope**: um avatar por jogador; catálogo inicial de 3–5 peças por categoria (6 categorias) conforme FR-012, mais um conjunto pequeno de tons de pele e estilos/cores de cabelo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` ainda está no template padrão (placeholders não preenchidos, nenhum princípio ratificado). Não há, portanto, princípios de governança ativos para checar nesta feature — o gate é tratado como **PASS por ausência de regras**. Recomendação: rodar `/speckit-constitution` antes de acumular mais features, para fixar princípios (ex.: cobertura de testes, simplicidade, sem backend desnecessário) que este plano já segue informalmente.

*Re-check pós Phase 1*: Nenhuma mudança — o design em Phase 1 (data-model.md, contracts/, quickstart.md) não introduz dependências externas, backend ou complexidade além do descrito acima. PASS mantido.

## Project Structure

### Documentation (this feature)

```text
specs/001-avatar-dress-up/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── avatar-save-state.schema.json
│   └── clothing-catalog.schema.json
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── assets/
│   ├── avatar/            # ilustrações base do corpo + variações de tom de pele/cabelo
│   └── clothing/          # ilustrações das peças de roupa, agrupadas por categoria
├── data/
│   └── catalog.ts         # catálogo estático tipado: categorias, peças, opções de pele/cabelo
├── state/
│   ├── avatarState.ts     # forma do estado do avatar + regras de conflito de slot (vestido x blusa/calça)
│   └── useAvatarStore.ts  # hook de estado (contexto/reducer React) usado pelos componentes
├── storage/
│   └── localAvatarStorage.ts  # save/load/reset em localStorage, com fallback seguro se corrompido
├── components/
│   ├── AvatarStage.tsx    # renderiza o avatar com as camadas empilhadas
│   ├── AppearancePanel.tsx # personalização de pele/cabelo (User Story 2)
│   ├── CategoryTabs.tsx   # navegação entre categorias de roupa
│   └── ItemGrid.tsx       # grade de seleção de peças de uma categoria
├── App.tsx
└── main.tsx

tests/
├── unit/                  # regras de slot (vestido substitui blusa+calça), fallback de storage corrompido
├── integration/           # componentes: selecionar peça → avatar atualiza; trocar pele/cabelo
└── e2e/                   # Playwright: montar look completo, recarregar página, confirmar persistência

index.html
vite.config.ts
package.json
```

**Structure Decision**: Projeto único de frontend (sem diretório `backend/`), já que a feature não requer nenhum serviço de servidor — toda a lógica de vestir/persistir roda no navegador. Segue o padrão "Option 1: Single project", adaptado para uma SPA React/Vite com uma pasta `assets/` dedicada às ilustrações do avatar e das roupas.

## Complexity Tracking

> Sem violações do Constitution Check a justificar — seção não aplicável (nenhum princípio ratificado, nenhuma complexidade extra introduzida além do necessário para a feature).
