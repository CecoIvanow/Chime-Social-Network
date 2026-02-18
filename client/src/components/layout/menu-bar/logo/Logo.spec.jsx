import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import Logo from "./Logo";

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