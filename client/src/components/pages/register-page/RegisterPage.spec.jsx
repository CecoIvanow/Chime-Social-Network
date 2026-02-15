import { Link, MemoryRouter } from "react-router";

import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../contexts/alert-context";

import RegisterPage from "./RegisterPage";

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({
        ...useUserServicesMock
    })
}));

vi.mock("../../shared/auth/auth-header-title/AuthHeaderTitle", () => ({
    default: ({ title }) => <div data-testid="header-title">{title}</div>
}));

vi.mock("../../shared/auth/auth-forms-list/AuthFormsList", () => ({
    default: ({ authFieldsList }) => <>
        <div data-testid="forms-list">
            {authFieldsList.map(field => <>
                <label htmlFor={field.inputName}>{field.fieldName}</label>
                <input
                    id={field.inputName}
                    type={field.inputType}
                    placeholder={field.placeholderText}
                />
            </>
            )}
        </div>
    </>
}));

vi.mock("../../shared/user-details/gender-details/GenderDetails", () => ({
    default: () => <div data-testid="gender-details"></div>
}));

vi.mock("../../ui/auth/auth-button/AuthButton", () => ({
    default: ({ buttonText, isPending }) => <button disabled={isPending}>{buttonText}</button>
}));

vi.mock("../../ui/auth/auth-nav-link/AuthNavLink", () => ({
    default: ({ path, buttonText }) => <Link to={path}>{buttonText}</Link>
}));

const ERR_MSG = {
    REGISTER: "Rejected register call!",
};

const registerFields = [
    { fieldName: 'First name', inputType: 'text', placeholderText: 'first name', inputName: 'firstName' },
    { fieldName: 'Last name', inputType: 'text', placeholderText: 'last name', inputName: 'lastName' },
    { fieldName: 'Email', inputType: 'email', placeholderText: 'email', inputName: 'email' },
    { fieldName: 'Birthday', inputType: 'date', placeholderText: 'birthday', inputName: 'birthday' },
    { fieldName: 'Password', inputType: 'password', placeholderText: 'password', inputName: 'password' },
    { fieldName: 'Confirm Password', inputType: 'password', placeholderText: 'password', inputName: 'rePass' },
];

const useUserServicesMock = {
    register: vi.fn(),
    abortAll: vi.fn(),
}

const setAlert = vi.fn();

function setup(options = {
    registerRejectedCall: false
}) {
    if (options.registerRejectedCall) {
        useUserServicesMock.register.mockRejectedValue(new Error(ERR_MSG.REGISTER));
    }

    return render(
        <MemoryRouter>
            <AlertContext.Provider value={{ setAlert }}>
                <RegisterPage />
            </AlertContext.Provider>
        </MemoryRouter>
    );
};

describe("RegisterPage component", () => {
    it("renders header title with correct text content", () => {
        setup();

        expect(screen.getByTestId("header-title")).toHaveTextContent("Register");
    });

    it("renders gender details component", () => {
        setup();

        expect(screen.getByTestId("gender-details")).toBeInTheDocument();
    });

    it("renders link button with correct text and href attributes", () => {
        setup();

        expect(screen.getByRole("link", { name: "Already have an account?" })).toHaveAttribute("href", "/login")
    });

    it("renders and correctly connects inputs with type and placeholder attributes", () => {
        setup();

        for (let i = 0; i < registerFields.length; i++) {
            expect(screen.getByLabelText(registerFields[i].fieldName)).toHaveAttribute("type", registerFields[i].inputType);
            expect(screen.getByLabelText(registerFields[i].fieldName)).toHaveAttribute("placeholder", registerFields[i].placeholderText);
        };
    });

    it("renders the register button", () => {
        setup();

        expect(screen.getByRole("button", { name: "Register" })).not.toBeDisabled();
    });

    it("registers the user after the register button is clicked", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Register" }));
        await waitFor(() => {
            expect(useUserServicesMock.register).toHaveBeenCalled();
        });
    });

    it("disables the register button while the register call is being executed", async () => {
        const user = userEvent.setup();
        let resolveRegister = () => null;

        useUserServicesMock.register.mockImplementation(() => {
            return new Promise((resolve) => {
                resolveRegister = resolve;
            });
        });

        setup();

        await user.click(screen.getByRole("button", { name: "Register" }));
        expect(screen.getByRole("button", { name: "Register" })).toBeDisabled();

        resolveRegister();
    });

    it("shows alert message on a failed register call", async () => {
        const user = userEvent.setup();
        setup({
            registerRejectedCall: true
        });

        await user.click(screen.getByRole("button", { name: "Register" }));
        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.REGISTER);
        });
    });

    it("aborts all ongoing calls on unmount", () => {
        const { unmount } = setup();

        unmount();
        expect(useUserServicesMock.abortAll).toHaveBeenCalled();
    });
});