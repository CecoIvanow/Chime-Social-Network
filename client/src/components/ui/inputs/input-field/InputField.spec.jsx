import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import InputField from "./InputField";

const props = {
    fieldName: "Age",
    inputName: "age",
    initialValue: "27",
    inputType: "string",
}

beforeEach(() => {
    render(
        <InputField
            fieldName={props.fieldName}
            inputName={props.inputName}
            initialValue={props.initialValue}
            inputType={props.inputType}
        />
    );
});

describe("InputField component", () => {
    it("links the label and input correctly via htmlFor and id attributes", () => {
        expect(screen.getByLabelText(props.fieldName)).toBeInTheDocument();
    });

    it("renders the input with correct value, name and type attributes", () => {
        const input = screen.getByLabelText(props.fieldName);

        expect(input).toHaveValue(props.initialValue);
        expect(input).toHaveAttribute("type", props.inputType);
        expect(input).toHaveAttribute("name", props.inputName);
    });
});