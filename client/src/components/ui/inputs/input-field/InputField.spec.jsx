import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import InputField from "./InputField";

beforeEach(() => {
    render(
        <InputField
            fieldName="Age"
            inputName="age"
            initialValue="27"
            inputType="string"
        />
    );
});

describe("InputField component", () => {
    it("links label and input correctly via htmlFor, id, and name attributes", () => {
        const label = screen.getByText("Age");
        const textarea = screen.getByLabelText("Age");

        expect(label).toHaveAttribute("for", "age");
        expect(textarea).toHaveAttribute("id", "age");
        expect(textarea).toHaveAttribute("name", "age");
    });

    it("renders textarea with default value and type", () => {
        const textarea = screen.getByLabelText("Age");

        expect(textarea).toHaveValue("27");
        expect(textarea).toHaveAttribute("type", "string");
    });
});