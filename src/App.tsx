import { useState } from "react";
import { AppearancePanel } from "./components/AppearancePanel";
import { AvatarStage } from "./components/AvatarStage";
import { CategoryTabs } from "./components/CategoryTabs";
import { ItemGrid } from "./components/ItemGrid";
import { catalog } from "./data/catalog";
import { AvatarStoreProvider, useAvatarStore } from "./state/useAvatarStore";
import styles from "./App.module.css";

function AppContent() {
  const { avatar, equipItem, unequipSlot, setSkinTone, setHairStyle } = useAvatarStore();
  const [activeCategoryId, setActiveCategoryId] = useState(catalog.categories[0].id);

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Vestir</h1>
      <div className={styles.layout}>
        <AvatarStage avatar={avatar} />
        <div className={styles.panels}>
          <AppearancePanel
            skinToneId={avatar.skinToneId}
            hairStyleId={avatar.hairStyleId}
            onSelectSkinTone={setSkinTone}
            onSelectHairStyle={setHairStyle}
          />
          <CategoryTabs activeCategoryId={activeCategoryId} onSelectCategory={setActiveCategoryId} />
          <ItemGrid
            categoryId={activeCategoryId}
            equippedItems={avatar.equippedItems}
            onEquip={equipItem}
            onUnequip={unequipSlot}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AvatarStoreProvider>
      <AppContent />
    </AvatarStoreProvider>
  );
}
