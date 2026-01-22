import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ErrorBoundary from "./ErrorBoundary";

vi.mock("./error-message/ErrorMessage", () => ({
    default: () => <p data-testid="error-message">Error</p>
}))

function ThrowError() {
    throw new Error("Successfully throw error on render!");
}

describe("ErrorBoundary component", () => {
    it("renders ErrorBoundary on error", () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
});