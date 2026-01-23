import { fireEvent, getSuggestedQuery, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import Logo from "./Logo";
import { MemoryRouter } from "react-router";

beforeEach(() => {
    render(
        <MemoryRouter>
            <Logo />
        </MemoryRouter>
    );
});

describe("Logo component", () => {
    it("renders component hardcoded attributes", () => {
        expect(screen.getByRole("link")).toHaveAttribute("href", "/");
        expect(screen.getByRole("link")).toHaveTextContent("Chime");
    });
});