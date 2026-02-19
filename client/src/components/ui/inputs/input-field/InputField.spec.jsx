import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import InputField from "./InputField";

const mockProps = {
    fieldName: "Age",
    inputName: "age",
    initialValue: "27",
    inputType: "string",
}

beforeEach(() => {
    render(
        <InputField
            {...mockProps}
        />
    );
});

describe("InputField component", () => {
    it("renders the input field with the correct value, name and type attributes", () => {
        const input = screen.getByLabelText(mockProps.fieldName);

        expect(input).toHaveValue(mockProps.initialValue);
        expect(input).toHaveAttribute("type", mockProps.inputType);
        expect(input).toHaveAttribute("name", mockProps.inputName);
    });
});