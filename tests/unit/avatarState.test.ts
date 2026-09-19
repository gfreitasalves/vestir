import { describe, expect, it } from "vitest";
import { avatarReducer, createDefaultAvatarState } from "../../src/state/avatarState";

describe("avatarReducer - regra de conflito do vestido (FR-007)", () => {
  it("equipar um vestido preenche top e bottom com o mesmo id", () => {
    const state = createDefaultAvatarState();
    const next = avatarReducer(state, { type: "EQUIP_ITEM", itemId: "dress-floral-01" });

    expect(next.equippedItems.top).toBe("dress-floral-01");
    expect(next.equippedItems.bottom).toBe("dress-floral-01");
  });

  it("equipar uma blusa depois de um vestido limpa o slot bottom que o vestido ocupava", () => {
    const withDress = avatarReducer(createDefaultAvatarState(), {
      type: "EQUIP_ITEM",
      itemId: "dress-floral-01",
    });

    const next = avatarReducer(withDress, { type: "EQUIP_ITEM", itemId: "top-striped-01" });

    expect(next.equippedItems.top).toBe("top-striped-01");
    expect(next.equippedItems.bottom).toBeNull();
  });

  it("equipar uma calça depois de um vestido limpa o slot top que o vestido ocupava", () => {
    const withDress = avatarReducer(createDefaultAvatarState(), {
      type: "EQUIP_ITEM",
      itemId: "dress-floral-01",
    });

    const next = avatarReducer(withDress, { type: "EQUIP_ITEM", itemId: "pants-denim-01" });

    expect(next.equippedItems.bottom).toBe("pants-denim-01");
    expect(next.equippedItems.top).toBeNull();
  });

  it("equipar uma blusa e depois uma calça não afeta o slot de sapato ou acessório (SC-004)", () => {
    let state = createDefaultAvatarState();
    state = avatarReducer(state, { type: "EQUIP_ITEM", itemId: "shoes-sneaker-01" });
    state = avatarReducer(state, { type: "EQUIP_ITEM", itemId: "top-striped-01" });
    state = avatarReducer(state, { type: "EQUIP_ITEM", itemId: "pants-denim-01" });

    expect(state.equippedItems.shoes).toBe("shoes-sneaker-01");
    expect(state.equippedItems.top).toBe("top-striped-01");
    expect(state.equippedItems.bottom).toBe("pants-denim-01");
  });

  it("trocar a peça de uma categoria substitui a anterior sem afetar outras categorias (FR-005, SC-004)", () => {
    let state = createDefaultAvatarState();
    state = avatarReducer(state, { type: "EQUIP_ITEM", itemId: "top-striped-01" });
    state = avatarReducer(state, { type: "EQUIP_ITEM", itemId: "shoes-sneaker-01" });

    const next = avatarReducer(state, { type: "EQUIP_ITEM", itemId: "top-solid-red-01" });

    expect(next.equippedItems.top).toBe("top-solid-red-01");
    expect(next.equippedItems.shoes).toBe("shoes-sneaker-01");
  });

  it("remover uma peça deixa o slot vazio (null), revelando a pele/roupa íntima básica (FR-006)", () => {
    const equipped = avatarReducer(createDefaultAvatarState(), {
      type: "EQUIP_ITEM",
      itemId: "top-striped-01",
    });

    const next = avatarReducer(equipped, { type: "UNEQUIP_SLOT", slot: "top" });

    expect(next.equippedItems.top).toBeNull();
  });

  it("equippedItems sempre tem exatamente as chaves top, bottom, shoes, accessory", () => {
    const state = createDefaultAvatarState();
    expect(Object.keys(state.equippedItems).sort()).toEqual(["accessory", "bottom", "shoes", "top"]);
  });
});
