import type { ClothingCatalog } from "../state/types";

// Corpo base + variações de tom de pele/cabelo
import skin01 from "../assets/avatar/skin-01.svg";
import skin02 from "../assets/avatar/skin-02.svg";
import skin03 from "../assets/avatar/skin-03.svg";
import hairBobBlack from "../assets/avatar/hair-bob-black.svg";
import hairCurlyBrown from "../assets/avatar/hair-curly-brown.svg";
import hairLongRed from "../assets/avatar/hair-long-red.svg";

// Vestidos
import dressFloral01 from "../assets/clothing/dress-floral-01.svg";
import dressSolidBlue01 from "../assets/clothing/dress-solid-blue-01.svg";
import dressSunny01 from "../assets/clothing/dress-sunny-01.svg";

// Blusas
import topStriped01 from "../assets/clothing/top-striped-01.svg";
import topSolidRed01 from "../assets/clothing/top-solid-red-01.svg";
import topGreen01 from "../assets/clothing/top-green-01.svg";

// Calças
import pantsDenim01 from "../assets/clothing/pants-denim-01.svg";
import pantsBlack01 from "../assets/clothing/pants-black-01.svg";
import pantsBeige01 from "../assets/clothing/pants-beige-01.svg";

// Shorts
import shortsDenim01 from "../assets/clothing/shorts-denim-01.svg";
import shortsPink01 from "../assets/clothing/shorts-pink-01.svg";
import shortsKhaki01 from "../assets/clothing/shorts-khaki-01.svg";

// Sapatos
import shoesSneaker01 from "../assets/clothing/shoes-sneaker-01.svg";
import shoesSneakerPink01 from "../assets/clothing/shoes-sneaker-pink-01.svg";
import shoesBoots01 from "../assets/clothing/shoes-boots-01.svg";

// Acessórios
import accessoryHat01 from "../assets/clothing/accessory-hat-01.svg";
import accessoryGlasses01 from "../assets/clothing/accessory-glasses-01.svg";
import accessoryBow01 from "../assets/clothing/accessory-bow-01.svg";

/**
 * Catálogo estático do jogo, seguindo contracts/clothing-catalog.schema.json.
 * FR-003: no mínimo as 6 categorias vestido/blusa/calça/short/sapato/acessório.
 * FR-007: "vestido" ocupa os slots top e bottom simultaneamente.
 * FR-012: cada categoria tem entre 3 e 5 peças no catálogo de lançamento.
 */
export const catalog: ClothingCatalog = {
  categories: [
    { id: "dress", label: "Vestido", slots: ["top", "bottom"] },
    { id: "top", label: "Blusa", slots: ["top"] },
    { id: "pants", label: "Calça", slots: ["bottom"] },
    { id: "shorts", label: "Short", slots: ["bottom"] },
    { id: "shoes", label: "Sapato", slots: ["shoes"] },
    { id: "accessory", label: "Acessório", slots: ["accessory"] },
  ],
  items: [
    { id: "dress-floral-01", categoryId: "dress", label: "Vestido floral rosa", asset: dressFloral01 },
    { id: "dress-solid-blue-01", categoryId: "dress", label: "Vestido azul liso", asset: dressSolidBlue01 },
    { id: "dress-sunny-01", categoryId: "dress", label: "Vestido amarelo sol", asset: dressSunny01 },

    { id: "top-striped-01", categoryId: "top", label: "Blusa listrada azul", asset: topStriped01 },
    { id: "top-solid-red-01", categoryId: "top", label: "Blusa vermelha lisa", asset: topSolidRed01 },
    { id: "top-green-01", categoryId: "top", label: "Blusa verde", asset: topGreen01 },

    { id: "pants-denim-01", categoryId: "pants", label: "Calça jeans", asset: pantsDenim01 },
    { id: "pants-black-01", categoryId: "pants", label: "Calça preta", asset: pantsBlack01 },
    { id: "pants-beige-01", categoryId: "pants", label: "Calça bege", asset: pantsBeige01 },

    { id: "shorts-denim-01", categoryId: "shorts", label: "Short jeans", asset: shortsDenim01 },
    { id: "shorts-pink-01", categoryId: "shorts", label: "Short rosa", asset: shortsPink01 },
    { id: "shorts-khaki-01", categoryId: "shorts", label: "Short cáqui", asset: shortsKhaki01 },

    { id: "shoes-sneaker-01", categoryId: "shoes", label: "Tênis branco", asset: shoesSneaker01 },
    { id: "shoes-sneaker-pink-01", categoryId: "shoes", label: "Tênis rosa", asset: shoesSneakerPink01 },
    { id: "shoes-boots-01", categoryId: "shoes", label: "Bota marrom", asset: shoesBoots01 },

    { id: "accessory-hat-01", categoryId: "accessory", label: "Chapéu vermelho", asset: accessoryHat01 },
    { id: "accessory-glasses-01", categoryId: "accessory", label: "Óculos de sol", asset: accessoryGlasses01 },
    { id: "accessory-bow-01", categoryId: "accessory", label: "Laço rosa", asset: accessoryBow01 },
  ],
  appearanceOptions: [
    { id: "skin-01", kind: "skinTone", label: "Tom de pele claro", asset: skin01, colorValue: "#F6D2B5" },
    { id: "skin-02", kind: "skinTone", label: "Tom de pele médio", asset: skin02, colorValue: "#C68642" },
    { id: "skin-03", kind: "skinTone", label: "Tom de pele escuro", asset: skin03, colorValue: "#7A4B28" },

    { id: "hair-bob-black", kind: "hairStyle", label: "Cabelo bob preto", asset: hairBobBlack },
    { id: "hair-curly-brown", kind: "hairStyle", label: "Cabelo cacheado castanho", asset: hairCurlyBrown },
    { id: "hair-long-red", kind: "hairStyle", label: "Cabelo longo ruivo", asset: hairLongRed },
  ],
};

export function getCategory(categoryId: string) {
  const category = catalog.categories.find((c) => c.id === categoryId);
  if (!category) throw new Error(`Unknown category: ${categoryId}`);
  return category;
}

export function getItem(itemId: string) {
  return catalog.items.find((i) => i.id === itemId);
}

export function getItemsByCategory(categoryId: string) {
  return catalog.items.filter((i) => i.categoryId === categoryId);
}

export function getAppearanceOptions(kind: "skinTone" | "hairStyle") {
  return catalog.appearanceOptions.filter((o) => o.kind === kind);
}
