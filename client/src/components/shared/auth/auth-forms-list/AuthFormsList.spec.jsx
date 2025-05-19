import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import AuthFormsList from "./AuthFormsList";

vi.mock("../../../ui/auth/auth-form/AuthForm", () => ({
    default: ({ fieldName, inputName, inputType, placeholderText }) => (
        <div data-testid="auth-form">
            <span>{fieldName}</span>
            <span>{inputName}</span>
            <span>{inputType}</span>
            <span>{placeholderText}</span>
        </div>
    ),
}));

const mockFields = [
    {
        fieldName: "Username",
        inputName: "username",
        inputType: "text",
        placeholderText: "Enter username",
    },
    {
        fieldName: "Password",
        inputName: "pass",
        inputType: "password",
        placeholderText: "Enter password",
    },
];

beforeEach(() => {
    render(<AuthFormsList
        authFieldsList={mockFields}
    />)
})

describe('AuthFormslist component', () => {
    it('renders with correct number of AuthForm components', () => {
        const authForms = screen.getAllByTestId('auth-form');
        
        expect(authForms).toHaveLength(mockFields.length);
    })

    it('renders Authform component with passed props', () => {
        for (const field of mockFields) {
            expect(screen.getByText(field.fieldName)).toBeInTheDocument();
            expect(screen.getByText(field.inputName)).toBeInTheDocument();
            expect(screen.getByText(field.inputType)).toBeInTheDocument();
            expect(screen.getByText(field.placeholderText)).toBeInTheDocument();
        }
    })
});