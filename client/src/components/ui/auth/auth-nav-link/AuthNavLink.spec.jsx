import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import AuthNavLink from "./AuthNavLink";

const mockProps = {
    buttonText: "Don't have an account?",
    path: "/register",
};

beforeEach(() => {
    render(
        <MemoryRouter>
            <AuthNavLink
                {...mockProps}
            />
        </MemoryRouter>
    );
});

describe('AuthNavLink component', () => {
    it('renders link with correct href and text attributes', () => {
        const link = screen.getByRole("link", { name: mockProps.buttonText });

        expect(link).toHaveAttribute('href', mockProps.path);
    })
})