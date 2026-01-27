import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import TextAreaInput from "./TextAreaInput";

const props = {
    fieldName: "Bio",
    initialValue: "Hello!",
    inputName: "bio",
};

beforeEach(() => {
    render(
        <TextAreaInput
            fieldName={props.fieldName}
            initialValue={props.initialValue}
            inputName={props.inputName}
        />
    );
});

describe("TextAreaInput component", () => {
    it("links label and textarea correctly via htmlFor and id attributes", () => {
        expect(screen.getByLabelText(props.fieldName));
    });

    it("renders textarea with correct value and name attributes", () => {
        const textarea = screen.getByLabelText(props.fieldName);

        expect(textarea).toHaveValue(props.initialValue);
        expect(textarea).toHaveAttribute("name", props.inputName);
    });
});