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
        expect(screen.getByLabelText(inputFieldProps.fieldName)).toBeInTheDocument();
    });

    it("renders the input with correct value, name and type attributes", () => {
        const input = screen.getByLabelText(inputFieldProps.fieldName);

        expect(input).toHaveValue(inputFieldProps.initialValue);
        expect(input).toHaveAttribute("type", inputFieldProps.inputType);
        expect(input).toHaveAttribute("name", inputFieldProps.inputName);
    });
});