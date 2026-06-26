import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the calculator", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Life Timer" })).toBeInTheDocument();
    expect(screen.getByLabelText("Birth date")).toBeInTheDocument();
  });

  it("switches language", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "RU" }));
    expect(screen.getByLabelText("Дата рождения")).toBeInTheDocument();
  });

  it("updates calculation when parameters change", async () => {
    render(<App />);
    expect(screen.getByPlaceholderText("MM/DD/YYYY")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Birth date"), "01011981");
    expect(screen.getByLabelText("Birth date")).toHaveValue("01/01/1981");
    expect(screen.getByText("Time lived")).toBeInTheDocument();
    const lifespan = screen.getByLabelText("Expected lifespan");
    await userEvent.clear(lifespan);
    await userEvent.type(lifespan, "90");
    expect(screen.getByText("Total left")).toBeInTheDocument();
  });

  it("adds a custom activity", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByPlaceholderText("Gym, music, study")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove" })).toHaveTextContent("-");
  });
});
