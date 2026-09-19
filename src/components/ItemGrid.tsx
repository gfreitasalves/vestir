import { getCategory, getItemsByCategory } from "../data/catalog";
import type { BodySlot, EquippedItems } from "../state/types";
import styles from "./ItemGrid.module.css";

interface ItemGridProps {
  categoryId: string;
  equippedItems: EquippedItems;
  onEquip: (itemId: string) => void;
  onUnequip: (slot: BodySlot) => void;
}

/**
 * Grade de seleção de peças da categoria ativa (FR-004), com opção de
 * remover a peça equipada (FR-006) e destaque visual da peça selecionada.
 */
export function ItemGrid({ categoryId, equippedItems, onEquip, onUnequip }: ItemGridProps) {
  const category = getCategory(categoryId);
  const items = getItemsByCategory(categoryId);
  const primarySlot = category.slots[0];
  const equippedInCategory = equippedItems[primarySlot];

  return (
    <div
      id={`category-panel-${categoryId}`}
      className={styles.grid}
      role="tabpanel"
      aria-labelledby={`category-tab-${categoryId}`}
    >
      {items.map((item) => {
        const isSelected = equippedInCategory === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={isSelected ? `${styles.itemButton} ${styles.selected}` : styles.itemButton}
            aria-pressed={isSelected}
            onClick={() => onEquip(item.id)}
          >
            <img className={styles.thumb} src={item.asset} alt="" aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
      {equippedInCategory && (
        <button
          type="button"
          className={styles.removeButton}
          aria-label={`Remover peça de ${category.label}`}
          onClick={() => onUnequip(primarySlot)}
        >
          Remover
        </button>
      )}
    </div>
  );
}
