import { test, expect } from "@playwright/test";

/**
 * SC-001: troca de roupa deve refletir visualmente em menos de 2s.
 * research.md define uma meta interna mais rígida de <100ms, já que é
 * apenas troca de camada de imagem, sem rede envolvida.
 */
test("trocar de peça de roupa atualiza o avatar com latência bem abaixo de 2s (SC-001)", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Blusa" }).click();

  const start = Date.now();
  await page.getByRole("button", { name: "Blusa listrada azul" }).click();
  await expect(page.getByTestId("avatar-layer-top")).toHaveAttribute(
    "data-asset-id",
    "top-striped-01",
  );
  const elapsedMs = Date.now() - start;

  expect(elapsedMs).toBeLessThan(2000);
});
