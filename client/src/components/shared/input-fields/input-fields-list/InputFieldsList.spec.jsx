import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import InputFieldsList from "./InputFieldsList.jsx";


vi.mock("../../../ui/inputs/input-field/InputField", () => ({
    default: ({ fieldName, inputName, inputType, initialValue }) => (
        <div data-testid="input-field" >
            <span>{fieldName}</span>
            <span>{inputName}</span>
            <span>{inputType}</span>
            <span>{initialValue}</span>
        </div>
    )
}));

const mockProps = [
    {
        fieldName: "Username",
        inputName: "username",
        inputType: "text",
        value: "Enter username",
    },
    {
        fieldName: "Password",
        inputName: "pass",
        inputType: "password",
        value: "Enter password",
    },
]

beforeEach(() => {
    render(<InputFieldsList
        inputFields={mockProps}
    />)
});

describe('InputFieldsList component', () => {
    it('renders with correct number of InputField components', () => {
        const inputFields = screen.getAllByTestId('input-field');

        expect(inputFields).toHaveLength(mockProps.length);
    });

    it('renders inputField component with passed props', () => {
        for (const field of mockProps) {
            expect(screen.getByText(field.fieldName)).toBeInTheDocument();
            expect(screen.getByText(field.inputName)).toBeInTheDocument();
            expect(screen.getByText(field.inputType)).toBeInTheDocument();
            expect(screen.getByText(field.value)).toBeInTheDocument();
        }
    })
})