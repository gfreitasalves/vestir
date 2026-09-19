# Tasks: Jogo de Vestir Avatares

**Input**: Design documents from `/specs/001-avatar-dress-up/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Incluídas. `plan.md`/`research.md` já definem a estratégia de testes da feature (Vitest + React Testing Library + Playwright) e `quickstart.md` documenta os comandos `npm test` / `npm run test:e2e` como parte da validação — as tarefas de teste abaixo implementam essa estratégia já decidida.

**Organization**: Tarefas agrupadas por user story (spec.md) para permitir implementação e teste independentes de cada uma.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de tarefas incompletas)
- **[Story]**: A qual user story a tarefa pertence (US1, US2, US3)
- Caminhos de arquivo exatos incluídos em cada descrição

## Path Conventions

Projeto único de frontend (sem backend), conforme `plan.md` > Structure Decision: `src/`, `tests/` na raiz do repositório.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização do projeto

- [X] T001 Criar o scaffold do projeto Vite + React + TypeScript na raiz do repositório, com a estrutura de pastas de `plan.md` > Project Structure (`src/assets/`, `src/data/`, `src/state/`, `src/storage/`, `src/components/`, `src/App.tsx`, `src/main.tsx`, `tests/unit/`, `tests/integration/`, `tests/e2e/`, `index.html`, `vite.config.ts`, `package.json`)
- [X] T002 Instalar as dependências principais: `react`, `react-dom`, `typescript`, `vite`, e as de desenvolvimento `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test`, conforme as decisões de `research.md` (React 18 + Vite; Vitest + RTL + Playwright)
- [X] T003 [P] Configurar ESLint + Prettier para TypeScript/React na raiz do repositório (`.eslintrc.cjs`, `.prettierrc`)
- [X] T004 [P] Configurar os test runners: Vitest (bloco `test` em `vite.config.ts` ou `vitest.config.ts`) e Playwright (`playwright.config.ts`), conforme a estratégia de testes de `research.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura central que TODAS as user stories precisam para funcionar

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase estar completa

- [X] T005 Definir os tipos de domínio em `src/state/types.ts`: `BodySlot` (`"top" | "bottom" | "shoes" | "accessory"`), `AppearanceOption`, `ClothingCategory`, `ClothingItem`, `AvatarState` — com exatamente os campos descritos em `data-model.md`
- [X] T006 [P] Escrever o catálogo estático de conteúdo em `src/data/catalog.ts`, seguindo `contracts/clothing-catalog.schema.json`: no mínimo as 6 categorias "vestido, blusa, calça, short, sapato e acessório" (FR-003), com `"vestido"` usando `slots: ["top", "bottom"]` (FR-007) e as demais um único slot; e "cada categoria deve ter no mínimo 3 e no máximo 5 ClothingItem no catálogo de lançamento" (FR-012, data-model.md), mais ao menos 1 `AppearanceOption` de `kind: "skinTone"` e 1 de `kind: "hairStyle"`
- [X] T007 [P] Criar as ilustrações 2D placeholder em estilo "funko/chibi" (FR-013) para o corpo base do avatar, as variações de tom de pele, os estilos de cabelo e cada peça do catálogo criado em T006, salvando-as em `src/assets/avatar/` e `src/assets/clothing/` nos caminhos referenciados pelo catálogo
- [X] T008 Implementar o reducer de estado do avatar em `src/state/avatarState.ts` com as ações `equipItem`, `unequipSlot`, `setSkinTone`, `setHairStyle`, `resetToDefault`, aplicando a regra do vestido: "ao equipar um item cuja categoria é 'vestido' ... os slots top e bottom são setados para o mesmo ClothingItem.id do vestido" e "ao equipar qualquer item de categoria 'blusa', 'calça' ou 'short' ... se o slot afetado continha um vestido, o outro slot que o vestido ocupava também é limpo" (FR-007, data-model.md), garantindo que `equippedItems` sempre tenha exatamente as chaves `top`, `bottom`, `shoes`, `accessory`
- [X] T009 [P] Implementar o hook `useAvatarStore` (Context + `useReducer` envolvendo `src/state/avatarState.ts`, somente em memória por enquanto) em `src/state/useAvatarStore.ts`
- [X] T010 [P] Implementar o componente `AvatarStage` em `src/components/AvatarStage.tsx`, empilhando corpo base → slot `bottom` → slot `top` (ou vestido) → `shoes` → cabelo → `accessory` por `z-index` fixo, mostrando a pele/roupa íntima básica nos slots com valor `null` (FR-006, FR-013)
- [X] T011 Montar o shell da aplicação em `src/App.tsx` e `src/main.tsx` (+ `index.html`), renderizando `AvatarStage` com o `AvatarState` padrão (primeira opção de `skinTone`/`hairStyle`, todos os slots `null` — FR-001) — depende de T008, T009, T010

**Checkpoint**: Fundação pronta — as user stories podem começar

---

## Phase 3: User Story 1 - Vestir o avatar com roupas (Priority: P1) 🎯 MVP

**Goal**: Jogador escolhe peças de roupa por categoria e vê o avatar atualizado visualmente na hora, incluindo a regra do vestido substituindo blusa+calça (FR-004 a FR-007).

**Independent Test**: Carregar o avatar padrão, selecionar peças de pelo menos duas categorias (ex.: blusa e calça) e confirmar que o avatar exibido é atualizado a cada escolha — funciona inteiramente em memória, sem depender de personalização de aparência (US2) ou persistência (US3).

### Tests for User Story 1 ⚠️

> **NOTE: Escrever estes testes PRIMEIRO, garantir que falham antes de implementar**

- [X] T012 [P] [US1] Teste unitário da regra de conflito do vestido em `tests/unit/avatarState.test.ts`: equipar um item de categoria "vestido" preenche `top` e `bottom` com o mesmo id; equipar em seguida uma "blusa"/"calça"/"short" limpa o outro slot que o vestido ocupava
- [X] T013 [P] [US1] Teste de integração em `tests/integration/dressUp.test.tsx`: selecionar uma peça de uma categoria atualiza a camada correspondente no `AvatarStage`; removê-la volta o slot para a camada de pele/roupa íntima básica (FR-006)

### Implementation for User Story 1

- [X] T014 [P] [US1] Implementar `CategoryTabs` em `src/components/CategoryTabs.tsx`, listando as 6 categorias do catálogo (`src/data/catalog.ts`) e controlando a categoria ativa
- [X] T015 [P] [US1] Implementar `ItemGrid` em `src/components/ItemGrid.tsx`, exibindo as peças da categoria ativa mais uma opção de "remover", chamando `equipItem`/`unequipSlot` de `useAvatarStore`
- [X] T016 [US1] Conectar `CategoryTabs` + `ItemGrid` + `AvatarStage` em `src/App.tsx` para completar o fluxo de vestir (depende de T014, T015)
- [X] T017 [P] [US1] Adicionar destaque visual (estado selecionado) para a peça atualmente equipada em cada categoria em `src/components/ItemGrid.module.css`

**Checkpoint**: User Story 1 totalmente funcional e testável de forma independente

---

## Phase 4: User Story 2 - Configurar/personalizar o avatar (Priority: P2)

**Goal**: Jogador personaliza tom de pele e cabelo do avatar antes/durante o processo de vestir (FR-002).

**Independent Test**: Abrir o painel de personalização, alterar tom de pele e cabelo, e confirmar que o avatar exibido muda de acordo — depois ir para a tela de roupas e confirmar que pele/cabelo escolhidos continuam aplicados junto com qualquer roupa vestida.

### Tests for User Story 2 ⚠️

- [X] T018 [P] [US2] Teste de integração em `tests/integration/appearance.test.tsx`: escolher um tom de pele ou estilo de cabelo diferente atualiza o `AvatarStage` imediatamente e permanece ao alternar para a aba de roupas

### Implementation for User Story 2

- [X] T019 [P] [US2] Implementar `AppearancePanel` em `src/components/AppearancePanel.tsx`, listando as `AppearanceOption` de `kind: "skinTone"` e `kind: "hairStyle"` do catálogo, chamando `setSkinTone`/`setHairStyle` de `useAvatarStore`
- [X] T020 [US2] Conectar `AppearancePanel` em `src/App.tsx` junto com a UI de vestir (depende de T019, T016)

**Checkpoint**: User Stories 1 e 2 funcionam juntas e de forma independente

---

## Phase 5: User Story 3 - Continuar de onde parou (Priority: P3)

**Goal**: Avatar e roupas escolhidas continuam salvos ao fechar/reabrir o jogo no mesmo dispositivo, sem login (FR-008 a FR-010).

**Independent Test**: Configurar um avatar com roupas específicas, recarregar a página, e confirmar que o mesmo avatar e as mesmas roupas aparecem; em um contexto de navegador sem dados salvos, confirmar que aparece o avatar padrão sem erro.

### Tests for User Story 3 ⚠️

- [X] T021 [P] [US3] Teste unitário em `tests/unit/localAvatarStorage.test.ts`: salvar e depois carregar retorna um `AvatarState` equivalente; chave ausente, JSON inválido e um `schemaVersion` inesperado caem todos para o `AvatarState` padrão sem lançar exceção (FR-010)
- [X] T022 [P] [US3] Teste e2e (Playwright) em `tests/e2e/persistence.spec.ts`: personalizar o avatar e vestir peças, recarregar a página, confirmar que a mesma pele/cabelo/roupas aparecem; abrir um contexto de navegador novo (sem storage) e confirmar que o avatar padrão aparece sem erro

### Implementation for User Story 3

- [X] T023 [US3] Implementar `src/storage/localAvatarStorage.ts` (save/load/reset sob a chave `vestir.avatarState.v1`) conforme `contracts/avatar-save-state.schema.json`: `schemaVersion` deve ser exatamente a constante `1`, `equippedItems` deve ter exatamente as chaves obrigatórias `top`, `bottom`, `shoes`, `accessory`; qualquer erro de parse ou `schemaVersion` divergente é tratado como dado corrompido e reseta para o padrão (FR-010)
- [X] T024 [US3] Conectar `src/state/useAvatarStore.ts` para hidratar a partir de `localAvatarStorage` ao montar e persistir a cada mudança de estado (equipar/remover/mudar aparência) — depende de T023, T009

**Checkpoint**: Todas as user stories funcionam de forma independente, incluindo persistência

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories

- [X] T025 [P] Adicionar texto alternativo/rótulos acessíveis nos controles de `CategoryTabs`, `ItemGrid` e `AppearancePanel` em `src/components/`
- [X] T026 Rodar a validação manual completa de `quickstart.md` (User Stories 1, 2 e 3) e corrigir qualquer divergência encontrada
- [X] T027 [P] Adicionar `README.md` na raiz do repositório com instruções de setup/execução/teste (`npm install`, `npm run dev`, `npm test`, `npm run test:e2e`)
- [X] T028 Verificar que a troca de peça de roupa mantém a latência percebida abaixo de 100ms (meta de `research.md`/SC-001), inspecionando no DevTools do navegador

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: depende da conclusão do Setup — BLOQUEIA todas as user stories
- **User Stories (Phase 3+)**: todas dependem da conclusão da fase Foundational
  - US1 (P1) não depende de US2 nem US3
  - US2 (P2) não depende de US1 para funcionar, mas se conecta ao mesmo `App.tsx` (T020 depende de T016 só por causa do arquivo compartilhado, não por lógica)
  - US3 (P3) não depende de US1/US2 para sua própria lógica de storage, mas só demonstra valor completo depois que há estado (pele/cabelo/roupas) para persistir
- **Polish (Phase 6)**: depende de todas as user stories desejadas estarem completas

### Within Each User Story

- Testes (quando incluídos) devem ser escritos e falhar antes da implementação
- Dentro de cada fase: tipos/estado compartilhado → componentes → integração no `App.tsx`

### Parallel Opportunities

- Todas as tarefas [P] do Setup podem rodar em paralelo
- No Foundational: T006 e T007 (catálogo e assets) podem rodar em paralelo entre si e com T005; T009 e T010 podem rodar em paralelo entre si (ambos dependem de T005/T008, mas não um do outro)
- Depois do Foundational, US1, US2 e US3 podem ser trabalhadas em paralelo por pessoas diferentes (compartilham apenas a integração final em `App.tsx`)
- Testes de uma mesma user story marcados [P] podem rodar em paralelo entre si

---

## Parallel Example: User Story 1

```bash
# Testes de User Story 1 em paralelo:
Task: "Teste unitário da regra de conflito do vestido em tests/unit/avatarState.test.ts"
Task: "Teste de integração de seleção de peça em tests/integration/dressUp.test.tsx"

# Componentes de User Story 1 em paralelo:
Task: "Implementar CategoryTabs em src/components/CategoryTabs.tsx"
Task: "Implementar ItemGrid em src/components/ItemGrid.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 apenas)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO — bloqueia todas as stories)
3. Completar Phase 3: User Story 1
4. **PARAR e VALIDAR**: testar User Story 1 de forma independente (avatar padrão + trocar roupas)
5. Já é um MVP demonstrável do "jogo de vestir"

### Incremental Delivery

1. Setup + Foundational → base pronta
2. + User Story 1 → testar independente → MVP demonstrável
3. + User Story 2 → testar independente → avatar personalizável
4. + User Story 3 → testar independente → progresso persiste entre sessões
5. Cada story agrega valor sem quebrar as anteriores

---

## Notes

- [P] = arquivos diferentes, sem dependência entre si
- [Story] mapeia a tarefa à user story correspondente para rastreabilidade
- Cada user story é completável e testável de forma independente
- Verificar que os testes falham antes de implementar
- Fazer commit após cada tarefa ou grupo lógico de tarefas
- Parar em qualquer checkpoint para validar a story isoladamente
