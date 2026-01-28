import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";

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
    it('renders link with path and buttonText props', () => {
        const link = screen.getByRole("link");

        expect(link).toHaveTextContent(mockProps.buttonText);
        expect(link).toHaveAttribute('href', mockProps.path);
    })
})