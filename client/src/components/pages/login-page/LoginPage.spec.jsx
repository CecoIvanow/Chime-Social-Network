import { Link, MemoryRouter } from "react-router";

import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../contexts/alert-context";

import LoginPage from "./LoginPage";

vi.mock("../../shared/auth/auth-header-title/AuthHeaderTitle", () => ({
    default: ({ title }) => <div data-testid="auth-header-title">{title}</div>
}));

vi.mock("../../shared/auth/auth-forms-list/AuthFormsList", () => ({
    default: ({ authFieldsList }) => (
        authFieldsList.map(field => <>
            <label data-testid="auth-forms-label" htmlFor={field.inputName}>{field.fieldName}</label>
            <input
                data-testid="auth-forms-input"
                id={field.inputName}
                name={field.inputName}
                type={field.inputType}
                placeholder={field.placeholderText}
            />
        </>
        )
    )
}))

vi.mock("../../ui/auth/auth-button/AuthButton", () => ({
    default: ({ buttonText, isPending }) => (
        <button
            type="submit"
            disabled={isPending}
        >
            {buttonText}
        </button>
    )
}));

vi.mock("../../ui/auth/auth-nav-link/AuthNavLink", () => ({
    default: ({ path, buttonText }) => (
        <Link
            to={path}>
            <button>
                {buttonText}
            </button>
        </Link>
    )
}));

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({ ...useUserServicesMock })
}));

const LOGIN_ERR_MSG = "Rejected login call!";

const loginFields = [
    { fieldName: 'Email', inputType: 'email', placeholderText: 'email', inputName: 'email' },
    { fieldName: 'Password', inputType: 'password', placeholderText: 'password', inputName: 'password' }
];

const useUserServicesMock = {
    login: vi.fn(),
    abortAll: vi.fn(),
}

const setAlert = vi.fn();

function setup(options = {
    loginRejectedReturnValue: false
}) {
    options.loginRejectedReturnValue ?
        useUserServicesMock.login.mockRejectedValue(new Error(LOGIN_ERR_MSG)) :
        useUserServicesMock.login.mockResolvedValue();

    const { unmount } = render(
        <MemoryRouter>
            <AlertContext.Provider value={{ setAlert }}>
                <LoginPage />
            </AlertContext.Provider>
        </MemoryRouter>
    );

    return { unmount };
}

describe("LoginPage component", () => {
    it("renders header title with 'Login' text content", () => {
        setup();

        expect(screen.getByTestId("auth-header-title")).toHaveTextContent("Login");
    });

    it("renders connected auth forms with type, name and placeholder attributes", () => {
        setup();

        const authFormsLabels = screen.getAllByTestId("auth-forms-label");
        const authFormsInputs = screen.getAllByTestId("auth-forms-input");

        for (let i = 0; i < loginFields.length; i++) {
            expect(authFormsLabels[i]).toHaveAttribute("for", loginFields[i].inputName);
            expect(authFormsInputs[i]).toHaveAttribute("id", loginFields[i].inputName);
            expect(authFormsInputs[i]).toHaveAttribute("name", loginFields[i].inputName);
            expect(authFormsInputs[i]).toHaveAttribute("type", loginFields[i].inputType);
            expect(authFormsInputs[i]).toHaveAttribute("placeholder", loginFields[i].placeholderText);
        }
    });

    it("renders login button", () => {
        setup();

        expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    it("renders link button with href attribute and correct text content", () => {
        setup();

        expect(screen.getByRole("link")).toHaveAttribute("href", "/register");
        expect(screen.getByRole("link")).toHaveTextContent("Don`t have an account?");
    });

    it("login button gets disabled after the form is submitted", async () => {
        const user = userEvent.setup();
        setup();

        user.click(screen.getByRole("button", { name: "Login" }));

        await waitFor(() => expect(screen.getByRole("button", { name: "Login" })).toBeDisabled());
    });

    it("logs in the user after the form is submitted", async () => {
        const user = userEvent.setup();
        setup();

        const PASSWORD_VALUE = "MySecretPassword!";
        const EMAIL_VALUE = "example@email.com";

        const inputs = screen.getAllByTestId("auth-forms-input");

        const emailInput = inputs.find(input => input.getAttribute("name") === "email");
        const passwordInput = inputs.find(input => input.getAttribute("name") === "password");

        await user.type(emailInput, EMAIL_VALUE);
        await user.type(passwordInput, PASSWORD_VALUE);

        await user.click(screen.getByRole("button", { name: "Login" }));

        await waitFor(() => expect(useUserServicesMock.login).toHaveBeenCalledWith({
            email: EMAIL_VALUE,
            password: PASSWORD_VALUE,
        }));
    });

    it("shows error message on a rejected login call", async () => {
        const user = userEvent.setup();
        setup({
            loginRejectedReturnValue: true
        });

        await user.click(screen.getByRole("button", { name: "Login" }))

        await waitFor(() => expect(setAlert).toHaveBeenCalledWith(LOGIN_ERR_MSG));
    });

    it("stops the ongoing login call on component unmount", async () => {
        const { unmount } = setup();

        unmount();

        await waitFor(() => expect(useUserServicesMock.abortAll).toHaveBeenCalled());
    });
});