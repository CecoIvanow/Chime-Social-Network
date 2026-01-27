import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import TextAreaInput from "./TextAreaInput";

const props = {
    fieldName: "Bio",
    initialValue: 'Hello!',
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

describe('TextAreaInput component', () => {
    it("links label and textarea correctly via htmlFor and id attributes", () => {
        const label = screen.getByText(props.fieldName);
        const textarea = screen.getByLabelText(props.fieldName);

        expect(label).toHaveAttribute('for', props.inputName);
        expect(textarea).toHaveAttribute('id', 'bio');
        expect(textarea).toHaveAttribute('name', 'bio');
    });

    it('renders textarea with correct value and name attributes', () => {
        const textarea = screen.getByLabelText(props.fieldName);
        expect(textarea).toHaveValue(props.initialValue);
    });
});