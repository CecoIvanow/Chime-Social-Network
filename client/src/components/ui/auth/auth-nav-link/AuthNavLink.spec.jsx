import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import AuthNavLink from "./AuthNavLink";
import { MemoryRouter } from "react-router";

const authNavLinkProps = {
    buttonLabel: "Don't have an account?",
    path: "/register",
};

beforeEach(() => {
    render(
        <MemoryRouter>
            <AuthNavLink
                path={authNavLinkProps.path}
                buttonText={authNavLinkProps.buttonLabel}
            />
        </MemoryRouter>
    );
});

describe('AuthNavLink component', () => {
    it('renders link with path and buttonText props', () => {
        const link = screen.getByText(authNavLinkProps.buttonLabel);

        expect(link).toHaveTextContent(authNavLinkProps.buttonLabel);
        expect(link).toHaveAttribute('href', authNavLinkProps.path);
    })
})