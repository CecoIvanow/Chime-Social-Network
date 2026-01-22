import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ErrorMessage from "./ErrorMessage";

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ onClickHandler, buttonName }) => (
        <button data-testid="error-message-button" onClick={onClickHandler}>{buttonName}</button>
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
}))

beforeEach(() => render(<ErrorMessage />));

describe("ErrorMessage component", () => {
    it("renders compnen with inner children", () => {
        expect(screen.getByTestId("error-message-button")).toHaveTextContent("Reload");

        expect(screen.getByTestId("error-icon")).toBeInTheDocument();
        expect(screen.getByTestId("header-message")).toBeInTheDocument();
        expect(screen.getByTestId("paragraph-message")).toBeInTheDocument();
    });


});