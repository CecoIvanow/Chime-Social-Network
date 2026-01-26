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
    it('renders with container and Link', () => {
        const container = screen.getByTestId('to-auth-container');
        const link = screen.getByText(authNavLinkProps.buttonLabel);

        expect(container).toBeInTheDocument();

        expect(link).toBeInTheDocument();
        expect(link).toHaveTextContent(authNavLinkProps.buttonLabel);
    })

    it('ensures Link is a child of the container', () => {
        const container = screen.getByTestId('to-auth-container');
        const link = screen.getByText(authNavLinkProps.buttonLabel);

        expect(container).toBeInTheDocument();
        expect(link).toBeInTheDocument();

        expect(container).toContainElement(link);
    })

    it('renders with passed props', () => {
        const link = screen.getByText(authNavLinkProps.buttonLabel);

        expect(link).toHaveTextContent(authNavLinkProps.buttonLabel);
        expect(link).toHaveAttribute('href', authNavLinkProps.path);
    })
})