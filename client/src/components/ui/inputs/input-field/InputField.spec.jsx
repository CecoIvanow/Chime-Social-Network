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
    it("links label and input correctly via htmlFor, id, and name attributes", () => {
        const label = screen.getByText(inputFieldProps.fieldName);
        const textarea = screen.getByLabelText(inputFieldProps.fieldName);

        expect(label).toHaveAttribute("for", inputFieldProps.inputName);
        expect(textarea).toHaveAttribute("id", inputFieldProps.inputName);
        expect(textarea).toHaveAttribute("name", inputFieldProps.inputName);
    });

    it("renders textarea with default value and type", () => {
        const textarea = screen.getByLabelText(inputFieldProps.fieldName);

        expect(textarea).toHaveValue(inputFieldProps.initialValue);
        expect(textarea).toHaveAttribute("type", inputFieldProps.inputType);
    });
});