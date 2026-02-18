import { MemoryRouter } from "react-router";

import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ErrorMessage from "./ErrorMessage";
import userEvent from "@testing-library/user-event";

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ onClickHandler, buttonName }) => (
        <button onClick={onClickHandler}>{buttonName}</button>
    )
}));

vi.mock("./error-icon/ErrorIcon", () => ({
    default: () => <div data-testid="error-icon"></div>
}));

vi.mock("./header-message/HeaderMessage", () => ({
    default: () => <h1 data-testid="header-message"></h1>
}));

vi.mock("./paragraph-message/ParagraphMessage", () => ({
    default: () => <p data-testid="paragraph-message"></p>
}));

beforeEach(() => {
    Object.defineProperty(window, "location", {
        value: {
            reload: vi.fn(),
        }
    })

    render(
        <MemoryRouter>
            <ErrorMessage />
        </MemoryRouter>
    );
});

describe("ErrorMessage component", () => {
    it("renders error icon, header message and paragraph message", () => {
        expect(screen.getByTestId("error-icon")).toBeInTheDocument();
        expect(screen.getByTestId("header-message")).toBeInTheDocument();
        expect(screen.getByTestId("paragraph-message")).toBeInTheDocument();
    });

    it("renders Reload button", () => {
        expect(screen.getByRole("button", { name: "Reload" })).toBeInTheDocument();
    });

    it("on Reload button click reloads the page", async () => {
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Reload" }));
        await waitFor(() => {
            expect(window.location.reload).toHaveBeenCalled();
        });
    });
});