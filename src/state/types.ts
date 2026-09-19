export type BodySlot = "top" | "bottom" | "shoes" | "accessory";

export type AppearanceKind = "skinTone" | "hairStyle";

export interface AppearanceOption {
  id: string;
  kind: AppearanceKind;
  label: string;
  asset: string;
  colorValue?: string;
}

export interface ClothingCategory {
  id: string;
  label: string;
  slots: BodySlot[];
}

export interface ClothingItem {
  id: string;
  categoryId: string;
  label: string;
  asset: string;
}

export interface ClothingCatalog {
  categories: ClothingCategory[];
  items: ClothingItem[];
  appearanceOptions: AppearanceOption[];
}

export type EquippedItems = Record<BodySlot, string | null>;

export const SCHEMA_VERSION = 1 as const;

export interface AvatarState {
  schemaVersion: typeof SCHEMA_VERSION;
  skinToneId: string;
  hairStyleId: string;
  equippedItems: EquippedItems;
}
