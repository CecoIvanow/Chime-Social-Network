import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RegisterPage from "./RegisterPage";

import useUserServices from "../../../hooks/useUserServices";

import { AlertContext } from "../../../contexts/alert-context";
import { Link, MemoryRouter } from "react-router";

vi.mock("../../../hooks/useUserServices");

vi.mock("../../ui/auth/auth-button/AuthButton", () => ({
    default: ({ buttonText, isPending }) =>
        <button
            data-testid="auth-button"
            disabled={isPending}
        >
            {buttonText}
        </button>
}));

vi.mock("../../ui/auth/auth-nav-link/AuthNavLink", () => ({
    default: ({ path, buttonText }) =>
        <Link
            data-testid="nav-link"
            to={path}
        >
            {buttonText}
        </Link>
}));

vi.mock("../../shared/user-details/gender-details/GenderDetails", () => ({
    default: () => <div data-testid="gender-details"></div>
}));

vi.mock("../../shared/auth/auth-header-title/AuthHeaderTitle", () => ({
    default: ({ title }) => <div data-testid="header-title">{title}</div>
}));

vi.mock("../../shared/auth/auth-forms-list/AuthFormsList", () => ({
    default: ({ authFieldsList }) => <>
        <div data-testid="forms-list">
            {authFieldsList.map(field => {
                <>
                    <label htmlFor={field.inputName}>{field.fieldName}</label>
                    <input
                        id={field.inputName}
                        type={field.inputType}
                        placeholder={field.placeholderText}
                    />
                </>
            })}
        </div>
    </>
}));

describe("RegisterPage component", () => {
    const abortAll = vi.fn();
    const register = vi.fn();
    const setAlert = vi.fn();

    const registerFields = [
        { fieldName: 'First name', inputType: 'text', placeholderText: 'first name', inputName: 'firstName' },
        { fieldName: 'Last name', inputType: 'text', placeholderText: 'last name', inputName: 'lastName' },
        { fieldName: 'Email', inputType: 'email', placeholderText: 'email', inputName: 'email' },
        { fieldName: 'Birthday', inputType: 'date', placeholderText: 'birthday', inputName: 'birthday' },
        { fieldName: 'Password', inputType: 'password', placeholderText: 'password', inputName: 'password' },
        { fieldName: 'Confirm Password', inputType: 'password', placeholderText: 'password', inputName: 'rePass' },
    ]

    function renderComp() {
        useUserServices.mockReturnValue({
            abortAll,
            register,
        });

        const { unmount } = render(
            <MemoryRouter>
                <AlertContext.Provider value={{ setAlert }}>
                    <RegisterPage />
                </AlertContext.Provider>
            </MemoryRouter>
        );

        return unmount;
    }

    it("renders AuthHeaderTitle with passed prop", () => {
        const pattern = /^Register$/;

        renderComp();

        expect(screen.getByTestId("header-title")).toHaveTextContent(pattern);
    });

    it("renders GenderDetails", () => {
        renderComp();

        expect(screen.getByTestId("gender-details")).toBeInTheDocument();
    });

    it("renders AuthNavLink with passed props", () => {
        renderComp();

        expect(screen.getByTestId("nav-link")).toBeInTheDocument();
        expect(screen.getByTestId("nav-link")).toHaveAttribute("href", "/login")
    });


    it("renders AuthButton enabled with passed props", () => {
        renderComp();

        expect(screen.getByTestId("auth-button")).not.toBeDisabled();
    });
});