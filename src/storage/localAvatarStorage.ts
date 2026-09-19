import { createDefaultAvatarState } from "../state/avatarState";
import { SCHEMA_VERSION, type AvatarState, type BodySlot } from "../state/types";

export const STORAGE_KEY = "vestir.avatarState.v1";

const REQUIRED_SLOTS: BodySlot[] = ["top", "bottom", "shoes", "accessory"];

/**
 * Valida a forma do objeto salvo contra contracts/avatar-save-state.schema.json.
 * `schemaVersion` deve ser exatamente a constante 1; `equippedItems` deve ter
 * exatamente as chaves obrigatórias top/bottom/shoes/accessory. Qualquer
 * desvio é tratado como dado corrompido (FR-010).
 */
function isValidAvatarState(value: unknown): value is AvatarState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  if (candidate.schemaVersion !== SCHEMA_VERSION) return false;
  if (typeof candidate.skinToneId !== "string" || candidate.skinToneId.length === 0) return false;
  if (typeof candidate.hairStyleId !== "string" || candidate.hairStyleId.length === 0) return false;

  const equipped = candidate.equippedItems;
  if (typeof equipped !== "object" || equipped === null) return false;
  const equippedRecord = equipped as Record<string, unknown>;
  const equippedKeys = Object.keys(equippedRecord).sort();
  const requiredSorted = [...REQUIRED_SLOTS].sort();
  if (equippedKeys.length !== requiredSorted.length) return false;
  if (!equippedKeys.every((key, index) => key === requiredSorted[index])) return false;

  for (const slot of REQUIRED_SLOTS) {
    const slotValue = equippedRecord[slot];
    if (slotValue !== null && typeof slotValue !== "string") return false;
  }

  return true;
}

/** Restaura o avatar salvo (FR-009), ou o padrão se ausente/corrompido (FR-010). */
export function loadAvatarState(): AvatarState {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return createDefaultAvatarState();
  }
  if (!raw) return createDefaultAvatarState();

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isValidAvatarState(parsed)) return createDefaultAvatarState();
    return parsed;
  } catch {
    return createDefaultAvatarState();
  }
}

/** Salva automaticamente o avatar no dispositivo do jogador (FR-008). */
export function saveAvatarState(state: AvatarState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage indisponível/cheio: falha silenciosamente, sem quebrar o jogo.
  }
}

/** Usado quando o save está corrompido, para garantir que nada fique salvo. */
export function resetAvatarState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
