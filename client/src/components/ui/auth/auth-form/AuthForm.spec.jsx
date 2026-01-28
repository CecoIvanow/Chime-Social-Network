import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";

import AuthForm from "./AuthForm";

const mockProps = {
    fieldName: "Username",
    inputName: "username",
    inputType: "text",
    placeholderText: "username",
};

const INPUT_PLACEHOLDER_TEXT = `Enter your ${mockProps.placeholderText}`;

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
            {...mockProps}
        />
    );

    return { rerender };
}

describe('AuthForm component', () => {
    it('renders auth form with correct attributes', () => {
        setup();

        const inputEl = screen.getByRole("textbox");
        expect(inputEl).toHaveAttribute("type", mockProps.inputType);
        expect(inputEl).toHaveAttribute("placeholder", `${INPUT_PLACEHOLDER_TEXT}`);
        expect(inputEl).toHaveAttribute("name", mockProps.inputName);
        expect(inputEl).toBeRequired();

        expect(screen.getByText(mockProps.fieldName)).toBeInTheDocument();
    });

    it("links label and input via htmlFor and id attributes", () => {
        setup();

        expect(screen.getByTestId("label-el")).toHaveAttribute("for", mockProps.inputName);
        expect(screen.getByRole("textbox")).toHaveAttribute("id", mockProps.inputName);
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
                fieldName={mockProps.fieldName}
                inputName={mockProps.inputName}
                inputType={mockProps.inputType}
                placeholderText={mockProps.placeholderText}
            />
        );

        expect(input).toHaveValue(USER_INPUTS.finalValue);
    });
});