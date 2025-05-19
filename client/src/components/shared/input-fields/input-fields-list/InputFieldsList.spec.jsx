import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import InputFieldsList from "./InputFieldsList";

vi.mock("../../../ui/inputs/input-field/InputField", () => ({
    default: ({ fieldName, inputName, inputType, initialValue }) => (
        <div data-testid="input-field">
            <span>{fieldName}</span>
            <span>{inputName}</span>
            <span>{inputType}</span>
            <span>{initialValue}</span>
        </div>
    )
}));

const mockedFields = [
    {
        fieldName: 'Age',
        inputName: 'age',
        inputType: 'number',
        value: '27',
    },
    {
        fieldName: 'First Name',
        inputName: 'firstName',
        inputType: 'string',
        value: 'Petar',
    },
];

beforeEach(() => {
    render(
        <InputFieldsList
            inputFields={mockedFields}
        />
    );
})

describe('InputFieldsList component', () => {
    it('renders with correct number of InputField components', () => {
        const inputFields = screen.getAllByTestId('input-field');

        expect(inputFields).toHaveLength(mockedFields.length)
    });

    it('renders InputField component with passed props', () => {
        for (const field of mockedFields) {
            expect(screen.getByText(field.fieldName)).toBeInTheDocument();
            expect(screen.getByText(field.inputName)).toBeInTheDocument();
            expect(screen.getByText(field.inputType)).toBeInTheDocument();
            expect(screen.getByText(field.value)).toBeInTheDocument();
        }
    })
})