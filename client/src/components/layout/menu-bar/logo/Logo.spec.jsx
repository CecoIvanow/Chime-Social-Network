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
    it("renders clickable link with correct text content and href attribute", () => {
        expect(screen.getByRole("link", { name: "Chime" })).toHaveAttribute("href", "/");
    });
});