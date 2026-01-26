import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthForm from "./AuthForm";

const authFormProps = {
    fieldName: "Username",
    inputName: "username",
    inputType: "text",
    placeholderText: "username",
};

function setup() {
    const { rerender } = render(
        <AuthForm
            fieldName={authFormProps.fieldName}
            inputName={authFormProps.inputName}
            inputType={authFormProps.inputType}
            placeholderText={authFormProps.placeholderText}
        />
    );

    return { rerender };
}

describe('AuthForm component', () => {
    it('renders with passed props', () => {
        setup();

        const details = screen.getByText(authFormProps.fieldName);
        const input = screen.getByPlaceholderText(`Enter your ${authFormProps.placeholderText}`);

        expect(details).toHaveTextContent(authFormProps.fieldName);

        expect(input).toHaveAttribute('type', authFormProps.inputType);
    });

    it('renders with correct input value on change', () => {
        setup();

        const input = screen.getByPlaceholderText(`Enter your ${authFormProps.placeholderText}`);


        fireEvent.change(input, { target: { value: '123' } });
        expect(input).toHaveValue('123');

        fireEvent.change(input, { target: { value: '123456' } });
        expect(input).toHaveValue('123456');
    });

    it('rerenders with default input value', () => {
        const { rerender } = setup();

        const input = screen.getByPlaceholderText(`Enter your ${authFormProps.placeholderText}`);


        fireEvent.change(input, { target: { value: '123' } });
        expect(input).toHaveValue('123');

        fireEvent.change(input, { target: { value: '123456' } });
        expect(input).toHaveValue('123456');

        rerender(
            <AuthForm
                fieldName={authFormProps.fieldName}
                inputName={authFormProps.inputName}
                inputType={authFormProps.inputType}
                placeholderText={authFormProps.placeholderText}
            />
        );

        expect(input).toHaveValue('123456');
    });
});