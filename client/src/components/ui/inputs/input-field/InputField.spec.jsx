import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import InputField from "./InputField";

const inputFieldProps = {
    fieldName: "Age",
    inputName: "age",
    initialValue: "27",
    inputType: "string",
}

beforeEach(() => {
    render(
        <InputField
            fieldName={inputFieldProps.fieldName}
            inputName={inputFieldProps.inputName}
            initialValue={inputFieldProps.initialValue}
            inputType={inputFieldProps.inputType}
        />
    );
});

describe("InputField component", () => {
    it("links the label and input correctly via htmlFor and id attributes", () => {
        const label = screen.getByText(inputFieldProps.fieldName);
        const textarea = screen.getByLabelText(inputFieldProps.fieldName);

        expect(label).toHaveAttribute("for", inputFieldProps.inputName);
        expect(textarea).toHaveAttribute("id", inputFieldProps.inputName);
    });

    it("renders the input with correct value, name and type attributes", () => {
        const textarea = screen.getByLabelText(inputFieldProps.fieldName);

        expect(textarea).toHaveValue(inputFieldProps.initialValue);
        expect(textarea).toHaveAttribute("type", inputFieldProps.inputType);
    });
});