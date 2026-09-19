import { catalog, getCategory, getItem, getAppearanceOptions } from "../data/catalog";
import { SCHEMA_VERSION, type AvatarState, type BodySlot, type EquippedItems } from "./types";

const EMPTY_SLOTS: EquippedItems = {
  top: null,
  bottom: null,
  shoes: null,
  accessory: null,
};

/** Avatar padrão exibido na primeira vez que o jogo é aberto (FR-001). */
export function createDefaultAvatarState(): AvatarState {
  const [defaultSkin] = getAppearanceOptions("skinTone");
  const [defaultHair] = getAppearanceOptions("hairStyle");
  if (!defaultSkin || !defaultHair) {
    throw new Error("Catalog must define at least one skinTone and one hairStyle option");
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    skinToneId: defaultSkin.id,
    hairStyleId: defaultHair.id,
    equippedItems: { ...EMPTY_SLOTS },
  };
}

export type AvatarAction =
  | { type: "EQUIP_ITEM"; itemId: string }
  | { type: "UNEQUIP_SLOT"; slot: BodySlot }
  | { type: "SET_SKIN_TONE"; optionId: string }
  | { type: "SET_HAIR_STYLE"; optionId: string }
  | { type: "RESET_TO_DEFAULT" }
  | { type: "REPLACE_STATE"; state: AvatarState };

/**
 * Regra do vestido (FR-007, data-model.md > AvatarState):
 * - Equipar um item de categoria "vestido" (slots top+bottom) preenche os
 *   dois slots com o mesmo id.
 * - Equipar um item que ocupa só "top" ou só "bottom" (blusa/calça/short)
 *   limpa o OUTRO slot, caso ele contivesse o mesmo vestido (que deixou de
 *   estar totalmente vestido).
 */
function equipItem(state: AvatarState, itemId: string): AvatarState {
  const item = getItem(itemId);
  if (!item) return state;
  const category = getCategory(item.categoryId);

  const nextEquipped: EquippedItems = { ...state.equippedItems };

  if (category.slots.length > 1) {
    // Vestido: ocupa múltiplos slots com o mesmo id.
    for (const slot of category.slots) {
      nextEquipped[slot] = itemId;
    }
  } else {
    const [slot] = category.slots;
    const previousInSlot = nextEquipped[slot];
    nextEquipped[slot] = itemId;

    if (previousInSlot) {
      const previousItem = getItem(previousInSlot);
      if (previousItem) {
        const previousCategory = getCategory(previousItem.categoryId);
        if (previousCategory.slots.length > 1) {
          // O slot afetado continha um vestido: limpa o(s) outro(s) slot(s) dele.
          for (const dressSlot of previousCategory.slots) {
            if (dressSlot !== slot && nextEquipped[dressSlot] === previousInSlot) {
              nextEquipped[dressSlot] = null;
            }
          }
        }
      }
    }
  }

  return { ...state, equippedItems: nextEquipped };
}

function unequipSlot(state: AvatarState, slot: BodySlot): AvatarState {
  const currentItemId = state.equippedItems[slot];
  const nextEquipped: EquippedItems = { ...state.equippedItems };
  nextEquipped[slot] = null;

  if (currentItemId) {
    const currentItem = getItem(currentItemId);
    if (currentItem) {
      const currentCategory = getCategory(currentItem.categoryId);
      if (currentCategory.slots.length > 1) {
        for (const dressSlot of currentCategory.slots) {
          if (nextEquipped[dressSlot] === currentItemId) {
            nextEquipped[dressSlot] = null;
          }
        }
      }
    }
  }

  return { ...state, equippedItems: nextEquipped };
}

export function avatarReducer(state: AvatarState, action: AvatarAction): AvatarState {
  switch (action.type) {
    case "EQUIP_ITEM":
      return equipItem(state, action.itemId);
    case "UNEQUIP_SLOT":
      return unequipSlot(state, action.slot);
    case "SET_SKIN_TONE":
      if (!catalog.appearanceOptions.some((o) => o.id === action.optionId && o.kind === "skinTone")) {
        return state;
      }
      return { ...state, skinToneId: action.optionId };
    case "SET_HAIR_STYLE":
      if (!catalog.appearanceOptions.some((o) => o.id === action.optionId && o.kind === "hairStyle")) {
        return state;
      }
      return { ...state, hairStyleId: action.optionId };
    case "RESET_TO_DEFAULT":
      return createDefaultAvatarState();
    case "REPLACE_STATE":
      return action.state;
    default:
      return state;
  }
}
