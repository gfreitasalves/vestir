import { catalog } from "../data/catalog";
import type { AvatarState } from "../state/types";
import styles from "./AvatarStage.module.css";

interface AvatarStageProps {
  avatar: AvatarState;
}

function findAppearanceAsset(id: string): { asset: string; label: string; id: string } | undefined {
  return catalog.appearanceOptions.find((o) => o.id === id);
}

function findItemAsset(id: string | null): { asset: string; label: string; id: string } | undefined {
  if (!id) return undefined;
  return catalog.items.find((i) => i.id === id);
}

/**
 * Empilha as camadas do avatar por z-index fixo (FR-013, research.md #3):
 * corpo base -> parte de baixo -> parte de cima/vestido -> sapato -> cabelo -> acessório.
 * Slots sem peça equipada simplesmente não renderizam camada extra, deixando
 * visível o corpo base (que já representa a pele/roupa íntima básica - FR-006).
 *
 * Cada camada é puramente decorativa (alt="" + aria-hidden) — a descrição
 * acessível fica no contêiner (role="img" + aria-label), evitando que um
 * leitor de tela anuncie 6 imagens separadas para um único avatar.
 * `data-asset-id` carrega o id do catálogo para asserções de teste estáveis,
 * já que builds de produção podem inlinar SVGs pequenos como data URIs.
 */
export function AvatarStage({ avatar }: AvatarStageProps) {
  const skin = findAppearanceAsset(avatar.skinToneId);
  const hair = findAppearanceAsset(avatar.hairStyleId);

  const { top, bottom, shoes, accessory } = avatar.equippedItems;
  const isDress = Boolean(top && top === bottom);

  const bottomItem = !isDress ? findItemAsset(bottom) : undefined;
  const topOrDressItem = findItemAsset(top);
  const shoesItem = findItemAsset(shoes);
  const accessoryItem = findItemAsset(accessory);

  const description = [skin?.label, hair?.label, bottomItem?.label, topOrDressItem?.label, shoesItem?.label, accessoryItem?.label]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={styles.stage}
      data-testid="avatar-stage"
      role="img"
      aria-label={`Avatar: ${description}`}
    >
      {skin && (
        <img
          className={styles.layer}
          src={skin.asset}
          alt=""
          aria-hidden="true"
          data-testid="avatar-layer-body"
          data-asset-id={skin.id}
        />
      )}
      {bottomItem && (
        <img
          className={styles.layer}
          src={bottomItem.asset}
          alt=""
          aria-hidden="true"
          data-testid="avatar-layer-bottom"
          data-asset-id={bottomItem.id}
        />
      )}
      {topOrDressItem && (
        <img
          className={styles.layer}
          src={topOrDressItem.asset}
          alt=""
          aria-hidden="true"
          data-testid={isDress ? "avatar-layer-dress" : "avatar-layer-top"}
          data-asset-id={topOrDressItem.id}
        />
      )}
      {shoesItem && (
        <img
          className={styles.layer}
          src={shoesItem.asset}
          alt=""
          aria-hidden="true"
          data-testid="avatar-layer-shoes"
          data-asset-id={shoesItem.id}
        />
      )}
      {hair && (
        <img
          className={styles.layer}
          src={hair.asset}
          alt=""
          aria-hidden="true"
          data-testid="avatar-layer-hair"
          data-asset-id={hair.id}
        />
      )}
      {accessoryItem && (
        <img
          className={styles.layer}
          src={accessoryItem.asset}
          alt=""
          aria-hidden="true"
          data-testid="avatar-layer-accessory"
          data-asset-id={accessoryItem.id}
        />
      )}
    </div>
  );
}
