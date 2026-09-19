import { test, expect } from "@playwright/test";

test.describe("Persistência local do avatar (User Story 3)", () => {
  test("personalizar avatar e vestir roupas sobrevive a um reload da página (FR-008, FR-009, SC-003)", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Tom de pele escuro" }).click();
    await page.getByRole("button", { name: "Cabelo longo ruivo" }).click();

    await page.getByRole("tab", { name: "Blusa" }).click();
    await page.getByRole("button", { name: "Blusa verde" }).click();

    await page.getByRole("tab", { name: "Sapato" }).click();
    await page.getByRole("button", { name: "Bota marrom" }).click();

    await expect(page.getByTestId("avatar-layer-body")).toHaveAttribute("data-asset-id", "skin-03");
    await expect(page.getByTestId("avatar-layer-top")).toHaveAttribute("data-asset-id", "top-green-01");

    await page.reload();

    await expect(page.getByTestId("avatar-layer-body")).toHaveAttribute("data-asset-id", "skin-03");
    await expect(page.getByTestId("avatar-layer-hair")).toHaveAttribute(
      "data-asset-id",
      "hair-long-red",
    );
    await expect(page.getByTestId("avatar-layer-top")).toHaveAttribute("data-asset-id", "top-green-01");
    await expect(page.getByTestId("avatar-layer-shoes")).toHaveAttribute(
      "data-asset-id",
      "shoes-boots-01",
    );
  });

  test("um contexto de navegador sem dados salvos mostra o avatar padrão sem erro", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");

    await expect(page.getByTestId("avatar-stage")).toBeVisible();
    await expect(page.getByTestId("avatar-layer-body")).toHaveAttribute("data-asset-id", "skin-01");
    expect(errors).toEqual([]);
  });

  test("dado corrompido em localStorage cai para o avatar padrão sem travar (FR-010)", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("vestir.avatarState.v1", "{not valid json"));

    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.reload();

    await expect(page.getByTestId("avatar-stage")).toBeVisible();
    await expect(page.getByTestId("avatar-layer-body")).toHaveAttribute("data-asset-id", "skin-01");
    expect(errors).toEqual([]);
  });
});
