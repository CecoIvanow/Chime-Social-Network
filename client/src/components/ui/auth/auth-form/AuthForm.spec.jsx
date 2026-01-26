import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";

import AuthForm from "./AuthForm";

const authFormProps = {
    fieldName: "Username",
    inputName: "username",
    inputType: "text",
    placeholderText: "username",
};

const PLACEHOLDER_START_TEXT = "Enter your ";

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
    it('renders auth form with correct attributes', () => {
        setup();

        const inputEl = screen.getByRole("textbox");

        expect(screen.getByText(authFormProps.fieldName)).toBeInTheDocument();

        expect(inputEl).toHaveAttribute("type", authFormProps.inputType);
        expect(inputEl).toHaveAttribute("placeholder", `${PLACEHOLDER_START_TEXT}${authFormProps.placeholderText}`);
        expect(inputEl).toHaveAttribute("name", authFormProps.inputName);
    });

    it('renders with correct input value on change', async () => {
        setup();

        const user = userEvent.setup();

        const input = screen.getByPlaceholderText(`${PLACEHOLDER_START_TEXT}${authFormProps.placeholderText}`);

        await user.type(input, '123');
        expect(input).toHaveValue('123');

        await user.type(input, '456');
        expect(input).toHaveValue('123456');
    });

    it('rerenders with default input value', async () => {
        const { rerender } = setup();

        const user = userEvent.setup();

        const input = screen.getByPlaceholderText(`${PLACEHOLDER_START_TEXT}${authFormProps.placeholderText}`);

        await user.type(input, '123');
        expect(input).toHaveValue('123');

        await user.type(input, '456');
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