import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDefaultAvatarState } from "../../src/state/avatarState";
import { STORAGE_KEY, loadAvatarState, resetAvatarState, saveAvatarState } from "../../src/storage/localAvatarStorage";
import type { AvatarState } from "../../src/state/types";

describe("localAvatarStorage (FR-008, FR-009, FR-010)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("salvar e depois carregar retorna um AvatarState equivalente", () => {
    const state: AvatarState = {
      ...createDefaultAvatarState(),
      equippedItems: { top: "top-striped-01", bottom: null, shoes: null, accessory: null },
    };

    saveAvatarState(state);
    const loaded = loadAvatarState();

    expect(loaded).toEqual(state);
  });

  it("chave ausente cai para o AvatarState padrão sem lançar exceção", () => {
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    const loaded = loadAvatarState();
    expect(loaded).toEqual(createDefaultAvatarState());
  });

  it("JSON inválido cai para o AvatarState padrão sem lançar exceção (FR-010)", () => {
    localStorage.setItem(STORAGE_KEY, "{not valid json");
    expect(() => loadAvatarState()).not.toThrow();
    expect(loadAvatarState()).toEqual(createDefaultAvatarState());
  });

  it("schemaVersion inesperado cai para o AvatarState padrão sem lançar exceção", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...createDefaultAvatarState(), schemaVersion: 999 }),
    );
    expect(() => loadAvatarState()).not.toThrow();
    expect(loadAvatarState()).toEqual(createDefaultAvatarState());
  });

  it("equippedItems com chaves faltando/extra é tratado como dado corrompido", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        skinToneId: "skin-01",
        hairStyleId: "hair-bob-black",
        equippedItems: { top: null, bottom: null, shoes: null }, // falta 'accessory'
      }),
    );
    expect(loadAvatarState()).toEqual(createDefaultAvatarState());
  });

  it("resetAvatarState limpa o dado salvo", () => {
    saveAvatarState(createDefaultAvatarState());
    resetAvatarState();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
