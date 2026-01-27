import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";

import AuthNavLink from "./AuthNavLink";

const props = {
    buttonLabel: "Don't have an account?",
    path: "/register",
};

beforeEach(() => {
    render(
        <MemoryRouter>
            <AuthNavLink
                path={props.path}
                buttonText={props.buttonLabel}
            />
        </MemoryRouter>
    );
});

describe('AuthNavLink component', () => {
    it('renders link with path and buttonText props', () => {
        const link = screen.getByRole("link");

        expect(link).toHaveTextContent(props.buttonLabel);
        expect(link).toHaveAttribute('href', props.path);
    })
})