import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthNavLink from "./AuthNavLink";
import { MemoryRouter } from "react-router";

describe('AuthNavLink component', () => {
    it('renders with container and Link', () => {
        render(
            <MemoryRouter>
                <AuthNavLink
                    buttonText="Don't have an account?"
                />
            </MemoryRouter>
        );

        const container = screen.getByTestId('to-auth-container');
        const link = screen.getByText("Don't have an account?");

        expect(container).toBeInTheDocument();

        expect(link).toBeInTheDocument();
        expect(link).toHaveTextContent("Don't have an account?");
    })

    it('ensures Link is a child of the container', () => {
        render(
            <MemoryRouter>
                <AuthNavLink
                    buttonText="Don't have an account?"
                />
            </MemoryRouter>
        );

        const container = screen.getByTestId('to-auth-container');
        const link = screen.getByText("Don't have an account?");

        expect(container).toBeInTheDocument();
        expect(link).toBeInTheDocument();

        expect(container).toContainElement(link);
    })

    it('renders with passed props', () => {
        render(
            <MemoryRouter>
                <AuthNavLink
                    path='login'
                    buttonText='Already registered?'
                />
            </MemoryRouter>
        );

        const link = screen.getByText('Already registered?');

        expect(link).toHaveTextContent('Already registered?');
        expect(link).toHaveAttribute('href', '/login');
    })
})