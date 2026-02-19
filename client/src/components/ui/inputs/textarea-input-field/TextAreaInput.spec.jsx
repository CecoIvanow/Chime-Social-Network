import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import TextAreaInput from "./TextAreaInput";

const mockProps = {
    fieldName: "Bio",
    initialValue: "Hello!",
    inputName: "bio",
};

beforeEach(() => {
    render(
        <TextAreaInput
            {...mockProps}
        />
    );
});

describe("TextAreaInput component", () => {
    it("renders textarea with the correct value and name attributes", () => {
        const textarea = screen.getByLabelText(mockProps.fieldName);

        expect(textarea).toHaveValue(mockProps.initialValue);
        expect(textarea).toHaveAttribute("name", mockProps.inputName);
    });
});