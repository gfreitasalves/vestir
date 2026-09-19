import { catalog } from "../data/catalog";
import styles from "./CategoryTabs.module.css";

interface CategoryTabsProps {
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

/** Lista as 6 categorias do catálogo (FR-003) e controla a categoria ativa. */
export function CategoryTabs({ activeCategoryId, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Categorias de roupa">
      {catalog.categories.map((category) => {
        const isActive = category.id === activeCategoryId;
        return (
          <button
            key={category.id}
            id={`category-tab-${category.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`category-panel-${category.id}`}
            className={isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
