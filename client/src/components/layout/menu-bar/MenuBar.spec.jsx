import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import MenuBar from "./MenuBar";

vi.mock("./logo/Logo", () => ({
    default: () => <div data-testid="logo"></div>
}));

vi.mock("./main-menu/MainMenu", () => ({
    default: () => <div data-testid="main-menu"></div>
}));

vi.mock("./auth-menu/AuthMenu", () => ({
    default: () => <div data-testid="auth-menu"></div>
}));

beforeEach(() => render(<MenuBar />));

describe("MenuBar component", () => {
    it("renders Logo, MainMenu and AuthMenu components", () => {
        expect(screen.getByTestId("logo")).toBeInTheDocument();
        expect(screen.getByTestId("auth-menu")).toBeInTheDocument();
        expect(screen.getByTestId("main-menu")).toBeInTheDocument();
    });
});