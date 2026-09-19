import { getAppearanceOptions } from "../data/catalog";
import styles from "./AppearancePanel.module.css";

interface AppearancePanelProps {
  skinToneId: string;
  hairStyleId: string;
  onSelectSkinTone: (optionId: string) => void;
  onSelectHairStyle: (optionId: string) => void;
}

/** Personalização de tom de pele e cabelo do avatar (FR-002, User Story 2). */
export function AppearancePanel({
  skinToneId,
  hairStyleId,
  onSelectSkinTone,
  onSelectHairStyle,
}: AppearancePanelProps) {
  const skinTones = getAppearanceOptions("skinTone");
  const hairStyles = getAppearanceOptions("hairStyle");

  return (
    <div>
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Tom de pele</p>
        <div className={styles.optionsRow}>
          {skinTones.map((option) => {
            const isSelected = option.id === skinToneId;
            return (
              <button
                key={option.id}
                type="button"
                className={isSelected ? `${styles.optionButton} ${styles.selected}` : styles.optionButton}
                aria-pressed={isSelected}
                onClick={() => onSelectSkinTone(option.id)}
              >
                <span className={styles.swatch} style={{ backgroundColor: option.colorValue }} />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Cabelo</p>
        <div className={styles.optionsRow}>
          {hairStyles.map((option) => {
            const isSelected = option.id === hairStyleId;
            return (
              <button
                key={option.id}
                type="button"
                className={isSelected ? `${styles.optionButton} ${styles.selected}` : styles.optionButton}
                aria-pressed={isSelected}
                onClick={() => onSelectHairStyle(option.id)}
              >
                <img src={option.asset} alt="" aria-hidden="true" className={styles.swatch} />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
