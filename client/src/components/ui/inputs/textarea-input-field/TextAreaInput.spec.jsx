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
    it("links label and textarea correctly via htmlFor and id attributes", () => {
        expect(screen.getByLabelText(mockProps.fieldName));
    });

    it("renders textarea with correct value and name attributes", () => {
        const textarea = screen.getByLabelText(mockProps.fieldName);

        expect(textarea).toHaveValue(mockProps.initialValue);
        expect(textarea).toHaveAttribute("name", mockProps.inputName);
    });
});