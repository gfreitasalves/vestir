import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { createElement } from "react";
import { avatarReducer } from "./avatarState";
import { loadAvatarState, saveAvatarState } from "../storage/localAvatarStorage";
import type { AvatarState, BodySlot } from "./types";

export interface AvatarStore {
  avatar: AvatarState;
  equipItem: (itemId: string) => void;
  unequipSlot: (slot: BodySlot) => void;
  setSkinTone: (optionId: string) => void;
  setHairStyle: (optionId: string) => void;
  resetToDefault: () => void;
}

const AvatarStoreContext = createContext<AvatarStore | null>(null);

export function AvatarStoreProvider({ children }: { children: ReactNode }) {
  // Hidrata a partir de localStorage ao montar (FR-009); loadAvatarState já
  // cai para o avatar padrão se não houver save ou se estiver corrompido (FR-010).
  const [avatar, dispatch] = useReducer(avatarReducer, undefined, loadAvatarState);

  // Persiste automaticamente a cada mudança de estado (FR-008) — equipar,
  // remover, trocar pele/cabelo.
  useEffect(() => {
    saveAvatarState(avatar);
  }, [avatar]);

  const equipItem = useCallback((itemId: string) => dispatch({ type: "EQUIP_ITEM", itemId }), []);
  const unequipSlot = useCallback((slot: BodySlot) => dispatch({ type: "UNEQUIP_SLOT", slot }), []);
  const setSkinTone = useCallback((optionId: string) => dispatch({ type: "SET_SKIN_TONE", optionId }), []);
  const setHairStyle = useCallback((optionId: string) => dispatch({ type: "SET_HAIR_STYLE", optionId }), []);
  const resetToDefault = useCallback(() => dispatch({ type: "RESET_TO_DEFAULT" }), []);

  const value = useMemo<AvatarStore>(
    () => ({ avatar, equipItem, unequipSlot, setSkinTone, setHairStyle, resetToDefault }),
    [avatar, equipItem, unequipSlot, setSkinTone, setHairStyle, resetToDefault],
  );

  return createElement(AvatarStoreContext.Provider, { value }, children);
}

export function useAvatarStore(): AvatarStore {
  const store = useContext(AvatarStoreContext);
  if (!store) {
    throw new Error("useAvatarStore must be used within an AvatarStoreProvider");
  }
  return store;
}
