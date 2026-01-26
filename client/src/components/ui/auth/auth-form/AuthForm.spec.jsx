import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthForm from "./AuthForm";

const authFormProps = {
    fieldName: "Username",
    inputName: "username",
    inputType: "text",
    placeholderText: "username",
};

describe('AuthForm component', () => {
    it('renders with passed props', () => {
        render(
            <AuthForm
                fieldName={authFormProps.fieldName}
                inputName={authFormProps.inputName}
                inputType={authFormProps.inputType}
                placeholderText={authFormProps.placeholderText}
            />
        )

        const details = screen.getByText('Username');
        const input = screen.getByPlaceholderText('Enter your username');

        expect(details).toHaveTextContent('Username');

        expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with correct input value on change', () => {
        render(
            <AuthForm
                placeholderText={authFormProps.placeholderText}
            />
        );

        const input = screen.getByPlaceholderText('Enter your username');

        fireEvent.change(input, { target: { value: '123' } });
        expect(input).toHaveValue('123');

        fireEvent.change(input, { target: { value: '123456' } });
        expect(input).toHaveValue('123456');
    });

    it('rerenders with default input value', () => {
        const { rerender } = render(
            <AuthForm
                placeholderText={authFormProps.placeholderText}
            />
        );

        const input = screen.getByPlaceholderText('Enter your username');

        fireEvent.change(input, { target: { value: '123' } });
        expect(input).toHaveValue('123');

        fireEvent.change(input, { target: { value: '123456' } });
        expect(input).toHaveValue('123456');

        rerender(
            <AuthForm
                placeholderText='username'
            />
        );

        expect(input).toHaveValue('123456');
    });
});