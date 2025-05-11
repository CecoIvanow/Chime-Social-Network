import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TextAreaInput from "./TextAreaInput";

describe('TextAreaInput component', () => {
    it('renders form-group container, input and textarea', () => {
        render(<TextAreaInput
            fieldName={'Biography'}
            inputName={'bio'}
        />);

        const formFroup = screen.getByTestId('form-group');
        const label = screen.getByText('Biography');
        const textarea = screen.getByLabelText('Biography');

        expect(formFroup).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(textarea).toBeInTheDocument();
    })

    it("links label and textarea correctly via htmlFor, id, and name attributes", () => {
        render(<TextAreaInput
            fieldName='Bio'
            inputName='bio'
        />)

        const label = screen.getByText('Bio');
        const textarea = screen.getByLabelText('Bio');

        expect(label).toHaveAttribute('for', 'bio');
        expect(textarea).toHaveAttribute('id', 'bio');
        expect(textarea).toHaveAttribute('name', 'bio');
    })

    it('renders textarea with default value', () => {
        render(<TextAreaInput
            inputName={'bio'}
            fieldName={'Bio'}
            initialValue={'Hello!'}
        />);

        const textarea = screen.getByLabelText('Bio');
        expect(textarea).toHaveValue('Hello!');
    })
})