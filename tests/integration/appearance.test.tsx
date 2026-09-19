import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../../src/App";

describe("Personalização do avatar (User Story 2)", () => {
  it("escolher um tom de pele diferente atualiza o AvatarStage imediatamente", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByTestId("avatar-layer-body")).toHaveAttribute("data-asset-id", "skin-01");

    await user.click(screen.getByRole("button", { name: "Tom de pele escuro" }));

    expect(screen.getByTestId("avatar-layer-body")).toHaveAttribute("data-asset-id", "skin-03");
  });

  it("escolher um estilo de cabelo diferente atualiza o AvatarStage e persiste ao trocar de aba", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Cabelo longo ruivo" }));
    expect(screen.getByTestId("avatar-layer-hair")).toHaveAttribute("data-asset-id", "hair-long-red");

    await user.click(screen.getByRole("tab", { name: "Blusa" }));
    await user.click(screen.getByRole("button", { name: "Blusa listrada azul" }));

    expect(screen.getByTestId("avatar-layer-hair")).toHaveAttribute("data-asset-id", "hair-long-red");
    expect(screen.getByTestId("avatar-layer-top")).toBeInTheDocument();
  });
});
