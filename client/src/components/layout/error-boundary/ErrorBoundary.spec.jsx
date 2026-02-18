import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ErrorBoundary from "./ErrorBoundary";

vi.mock("./error-message/ErrorMessage", () => ({
    default: () => <p data-testid="error-message">Error</p>
}))

function ThrowError() {
    throw new Error("Successfully throw error on render!");
}

describe("ErrorBoundary component", () => {
    it("shows an error message on render failure", () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });

    it("renders children when there is no render error", () => {
        render(
            <ErrorBoundary>
                <div data-testid="child-component">Child</div>
            </ErrorBoundary>
        );

        expect(screen.getByTestId("child-component")).toBeInTheDocument();
    });
});