import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthButton from "./AuthButton";

describe('AuthButton component', () => {
    it('renders a submit button with the correct text and container', () => {
        render(<AuthButton
            buttonText="Login"
        />);

        const container = screen.getByTestId('button-auth');
        const input = screen.getByText('Login');

        expect(container).toBeInTheDocument();
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('Login');
        expect(input).toHaveAttribute('type', 'submit');
    });

    it('isPending is false by default', () => {
        render(<AuthButton
            buttonText="Login"
        />);

        const input = screen.getByText('Login');

        expect(input).not.toBeDisabled();
    })

    it('is disabled if isPending is true', () => {
        render(<AuthButton
            buttonText="Loading..."
            isPending={true}
        />);

        const input = screen.getByText('Loading...');

        expect(input).toBeDisabled();
    })
})