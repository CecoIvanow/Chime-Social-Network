import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import InputField from "./InputField";

describe("InputField component", () => {
    it("renders with form-group container, label and input", () => {
        render(<InputField
            fieldName="Age"
            inputName="age"
        />)

        const formGroup = screen.getByTestId("form-group");
        const label = screen.getByText("Age");
        const textarea = screen.getByLabelText("Age");

        expect(formGroup).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(textarea).toBeInTheDocument();
    });

    it("links label and input correctly via htmlFor, id, and name attributes", () => {
        render(<InputField
            fieldName="Age"
            inputName="age"
        />)

        const label = screen.getByText("Age");
        const textarea = screen.getByLabelText("Age");

        expect(label).toHaveAttribute("for", "age");
        expect(textarea).toHaveAttribute("id", "age");
        expect(textarea).toHaveAttribute("name", "age");
    })

    it("renders textarea with default value and type", () => {
        render(<InputField
            fieldName="Age"
            inputName="age"
            initialValue="27"
            inputType="string"
        />)

        const textarea = screen.getByLabelText("Age");

        expect(textarea).toHaveValue("27");
        expect(textarea).toHaveAttribute("type", "string");
    })
})