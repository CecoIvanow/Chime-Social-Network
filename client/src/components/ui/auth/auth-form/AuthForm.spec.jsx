import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";

import AuthForm from "./AuthForm";

const authFormProps = {
    fieldName: "Username",
    inputName: "username",
    inputType: "text",
    placeholderText: "username",
};

const INPUT_PLACEHOLDER_TEXT = `Enter your ${authFormProps.placeholderText}`;

const USER_INPUTS = {
    firstChange: "123",
    secondChange: "456",
    get finalValue() {
        return this.firstChange + this.secondChange
    }
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
    it('renders auth form with correct attributes', () => {
        setup();

        const inputEl = screen.getByRole("textbox");
        expect(inputEl).toHaveAttribute("type", authFormProps.inputType);
        expect(inputEl).toHaveAttribute("placeholder", `${INPUT_PLACEHOLDER_TEXT}`);
        expect(inputEl).toHaveAttribute("name", authFormProps.inputName);

        expect(screen.getByText(authFormProps.fieldName)).toBeInTheDocument();
    });

    it("links label and input via htmlFor and id attributes", () => {
        setup();

        expect(screen.getByTestId("label-el")).toHaveAttribute("for", authFormProps.inputName);
        expect(screen.getByRole("textbox")).toHaveAttribute("id", authFormProps.inputName);
    });

    it('input updates value on user text typing', async () => {
        const user = userEvent.setup();
        setup();

        const input = screen.getByRole("textbox");

        await user.type(input, USER_INPUTS.firstChange);
        expect(input).toHaveValue(USER_INPUTS.firstChange);

        await user.type(input, USER_INPUTS.secondChange);
        expect(input).toHaveValue(USER_INPUTS.finalValue);
    });

    it('rerenders with default input value', async () => {
        const user = userEvent.setup();
        const { rerender } = setup();

        const input = screen.getByPlaceholderText(`${INPUT_PLACEHOLDER_TEXT}`);

        await user.type(input, USER_INPUTS.firstChange);
        expect(input).toHaveValue(USER_INPUTS.firstChange);

        await user.type(input, USER_INPUTS.secondChange);
        expect(input).toHaveValue(USER_INPUTS.finalValue);


        rerender(
            <AuthForm
                fieldName={authFormProps.fieldName}
                inputName={authFormProps.inputName}
                inputType={authFormProps.inputType}
                placeholderText={authFormProps.placeholderText}
            />
        );

        expect(input).toHaveValue(USER_INPUTS.finalValue);
    });
});