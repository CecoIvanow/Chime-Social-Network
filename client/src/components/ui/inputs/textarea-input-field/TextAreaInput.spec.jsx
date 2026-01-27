import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import TextAreaInput from "./TextAreaInput";

beforeEach(() => {
    render(
        <TextAreaInput
            inputName={'bio'}
            fieldName={'Bio'}
            initialValue={'Hello!'}
        />
    );
});

describe('TextAreaInput component', () => {
    it("links label and textarea correctly via htmlFor and id attributes", () => {
        const label = screen.getByText('Bio');
        const textarea = screen.getByLabelText('Bio');

        expect(label).toHaveAttribute('for', 'bio');
        expect(textarea).toHaveAttribute('id', 'bio');
        expect(textarea).toHaveAttribute('name', 'bio');
    });

    it('renders textarea with correct value and name attributes', () => {
        const textarea = screen.getByLabelText('Bio');
        expect(textarea).toHaveValue('Hello!');
    });
});