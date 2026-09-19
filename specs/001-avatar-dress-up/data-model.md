# Data Model: Jogo de Vestir Avatares

Modelo derivado das Key Entities da spec (`spec.md`) e das decisões de `research.md`. Não há banco de dados — estas são as formas de dados usadas em memória (estado React) e persistidas em `localStorage`.

## Entidades

### AppearanceOption (opção de tom de pele / cabelo)

Representa uma opção selecionável de personalização do avatar (FR-002).

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `string` | Identificador único e estável da opção (ex.: `"skin-03"`, `"hair-bob-red"`) |
| `kind` | `"skinTone" \| "hairStyle"` | A que tipo de personalização a opção pertence |
| `label` | `string` | Nome legível exibido na UI (ex.: "Cabelo cacheado ruivo") |
| `asset` | `string` | Caminho/ref para a ilustração 2D correspondente (SVG/PNG) |
| `colorValue` | `string?` | Valor de cor associado, quando aplicável (ex.: usado para tons de pele que recolorem o corpo base via SVG) |

**Regras de validação**:
- `id` é único dentro do mesmo `kind`.
- Deve existir pelo menos 1 opção de `skinTone` e 1 de `hairStyle` (senão o avatar padrão de FR-001 não pode ser montado).

---

### ClothingCategory (categoria de roupa)

Agrupamento de peças do mesmo tipo (FR-003). Catálogo fixo definido pelo time de desenvolvimento (Assumptions).

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `string` | Identificador único (ex.: `"dress"`, `"top"`, `"bottom"`, `"shoes"`, `"accessory"`) |
| `label` | `string` | Nome exibido na UI (ex.: "Vestido", "Blusa") |
| `slots` | `BodySlot[]` | Um ou mais slots do corpo que peças desta categoria ocupam ao serem vestidas |

**Categorias mínimas exigidas por FR-003**: vestido, blusa, calça, short, sapato, acessório. Note que "calça" e "short" são categorias distintas na UI, mas ambas mapeiam para o mesmo `BodySlot` (`bottom`) — ver regra de conflito abaixo.

---

### BodySlot (slot do corpo)

Enumeração interna (não uma entidade exposta na UI), usada para resolver conflitos entre categorias:

```
BodySlot = "top" | "bottom" | "shoes" | "accessory"
```

- Categoria "blusa" → slot `top`
- Categorias "calça" e "short" → slot `bottom`
- Categoria "vestido" → slots `top` **e** `bottom` simultaneamente (FR-007)
- Categoria "sapato" → slot `shoes`
- Categoria "acessório" → slot `accessory`

---

### ClothingItem (peça de roupa)

Representa um item vestível (FR-004 a FR-007, FR-012).

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `string` | Identificador único e estável (ex.: `"dress-floral-01"`) |
| `categoryId` | `string` | Referência ao `ClothingCategory.id` |
| `label` | `string` | Nome exibido na UI (ex.: "Vestido floral") |
| `asset` | `string` | Caminho/ref para a ilustração 2D da peça (SVG/PNG, estilo "funko/chibi", vista frontal — FR-013) |

**Regras de validação**:
- `categoryId` deve existir em `ClothingCategory`.
- Cada categoria deve ter no mínimo 3 e no máximo 5 `ClothingItem` no catálogo de lançamento (FR-012).

---

### AvatarState (estado do avatar — em memória e persistido)

Representa o personagem configurado pelo jogador (Key Entity "Avatar"). É o objeto serializado em `localStorage` (ver `contracts/avatar-save-state.schema.json`).

| Campo | Tipo | Descrição |
|---|---|---|
| `schemaVersion` | `number` | Versão do formato salvo, para permitir migrações futuras sem quebrar saves antigos |
| `skinToneId` | `string` | Referência a um `AppearanceOption` com `kind = "skinTone"` |
| `hairStyleId` | `string` | Referência a um `AppearanceOption` com `kind = "hairStyle"` |
| `equippedItems` | `Record<BodySlot, string \| null>` | Para cada slot do corpo, o `ClothingItem.id` atualmente vestido nele, ou `null` se vazio (mostra pele/roupa íntima básica — FR-006) |

**Regras de validação / invariantes** (aplicadas pela lógica de estado, não apenas pelo schema):

1. `equippedItems` sempre tem exatamente as chaves `top`, `bottom`, `shoes`, `accessory` — nunca chaves extras nem faltando.
2. **Regra do vestido (FR-007)**: ao equipar um item cuja categoria é "vestido" (ocupa `top` + `bottom`), os slots `top` e `bottom` são setados para o mesmo `ClothingItem.id` do vestido. Ao equipar qualquer item de categoria "blusa", "calça" ou "short" (ocupa só `top` ou só `bottom`), se o slot afetado continha um vestido, o **outro** slot que o vestido ocupava também é limpo (`null`), pois o vestido deixou de estar totalmente vestido.
3. `skinToneId` e `hairStyleId` sempre referenciam um `AppearanceOption` existente; nunca ficam vazios (avatar padrão de FR-001 já nasce com valores default).

**Transições de estado** (todas síncronas, disparadas por ação do jogador):

- `equipItem(itemId)` → resolve a categoria do item, aplica a regra do vestido acima, atualiza `equippedItems`, salva em `localStorage`.
- `unequipSlot(slot)` → seta aquele slot para `null` (e, se fosse parte de um vestido, o outro slot do vestido também), salva.
- `setSkinTone(optionId)` / `setHairStyle(optionId)` → atualiza o campo correspondente, salva.
- `resetToDefault()` → usado quando o save salvo está ausente/corrompido (FR-010): recria o `AvatarState` com os valores default (primeira opção de cada `AppearanceOption`, todos os slots `null`).

---

## Relacionamentos

```
AppearanceOption (skinTone) ──┐
                               ├──< referenciados por >── AvatarState
AppearanceOption (hairStyle) ─┘

ClothingCategory ──< contém >── ClothingItem ──< referenciado por (via id) >── AvatarState.equippedItems
```

Não há relações de banco de dados (chaves estrangeiras reais) — o catálogo (`ClothingCategory`, `ClothingItem`, `AppearanceOption`) é conteúdo estático versionado no código (`src/data/catalog.ts`), e `AvatarState` guarda apenas referências por `id` a esse catálogo.
