import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../../src/App";

describe("Fluxo de vestir o avatar (User Story 1)", () => {
  it("selecionar uma peça de uma categoria atualiza a camada correspondente no AvatarStage", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByTestId("avatar-layer-top")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Blusa" }));
    await user.click(screen.getByRole("button", { name: "Blusa listrada azul" }));

    expect(screen.getByTestId("avatar-layer-top")).toHaveAttribute(
      "data-asset-id",
      "top-striped-01",
    );
  });

  it("remover a peça equipada volta o slot para a camada de pele/roupa íntima básica (FR-006)", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("tab", { name: "Blusa" }));
    await user.click(screen.getByRole("button", { name: "Blusa listrada azul" }));
    expect(screen.getByTestId("avatar-layer-top")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remover peça de Blusa" }));
    expect(screen.queryByTestId("avatar-layer-top")).not.toBeInTheDocument();
  });

  it("selecionar um vestido substitui blusa e calça equipadas (FR-007)", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("tab", { name: "Blusa" }));
    await user.click(screen.getByRole("button", { name: "Blusa listrada azul" }));
    await user.click(screen.getByRole("tab", { name: "Calça" }));
    await user.click(screen.getByRole("button", { name: "Calça jeans" }));

    await user.click(screen.getByRole("tab", { name: "Vestido" }));
    await user.click(screen.getByRole("button", { name: "Vestido floral rosa" }));

    expect(screen.getByTestId("avatar-layer-dress")).toHaveAttribute(
      "data-asset-id",
      "dress-floral-01",
    );
    expect(screen.queryByTestId("avatar-layer-top")).not.toBeInTheDocument();
    expect(screen.queryByTestId("avatar-layer-bottom")).not.toBeInTheDocument();
  });
});
