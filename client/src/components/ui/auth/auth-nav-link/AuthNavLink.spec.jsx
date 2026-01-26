import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthNavLink from "./AuthNavLink";
import { MemoryRouter } from "react-router";

const authNavLinkProps = {
    buttonLabel: "Don't have an account?",
    path: "/register",
}

describe('AuthNavLink component', () => {
    it('renders with container and Link', () => {
        render(
            <MemoryRouter>
                <AuthNavLink
                    buttonText={authNavLinkProps.buttonLabel}
                />
            </MemoryRouter>
        );

        const container = screen.getByTestId('to-auth-container');
        const link = screen.getByText(authNavLinkProps.buttonLabel);

        expect(container).toBeInTheDocument();

        expect(link).toBeInTheDocument();
        expect(link).toHaveTextContent(authNavLinkProps.buttonLabel);
    })

    it('ensures Link is a child of the container', () => {
        render(
            <MemoryRouter>
                <AuthNavLink
                    buttonText={authNavLinkProps.buttonLabel}
                />
            </MemoryRouter>
        );

        const container = screen.getByTestId('to-auth-container');
        const link = screen.getByText(authNavLinkProps.buttonLabel);

        expect(container).toBeInTheDocument();
        expect(link).toBeInTheDocument();

        expect(container).toContainElement(link);
    })

    it('renders with passed props', () => {
        render(
            <MemoryRouter>
                <AuthNavLink
                    path={authNavLinkProps.path}
                    buttonText={authNavLinkProps.buttonLabel}
                />
            </MemoryRouter>
        );

        const link = screen.getByText(authNavLinkProps.buttonLabel);

        expect(link).toHaveTextContent(authNavLinkProps.buttonLabel);
        expect(link).toHaveAttribute('href', authNavLinkProps.path);
    })
})