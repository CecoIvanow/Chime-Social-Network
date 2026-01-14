import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { AlertContext } from "../../../contexts/alert-context";

import LoginPage from "./LoginPage";
import { Link, MemoryRouter } from "react-router";

vi.mock("../../shared/auth/auth-header-title/AuthHeaderTitle", () => ({
    default: ({ title }) => <h4 data-testid="auth-header-title">{title}</h4>
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
            data-testid="auth-button"
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
            data-testid="auth-nav-link"
            to={path}>
            <button>
                {buttonText}
            </button>
        </Link>
    )
}));

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({
        login: loginMock,
        abortAll: abortAllMock,
    })
}));

const LOGIN_ERR_MSG = "Successfullly rejected login call!";

const loginFields = [
    { fieldName: 'Email', inputType: 'email', placeholderText: 'email', inputName: 'email' },
    { fieldName: 'Password', inputType: 'password', placeholderText: 'password', inputName: 'password' }
];

const abortAllMock = vi.fn();
const loginMock = vi.fn();

const setAlert = vi.fn();

function setup(options = {
    loginRejectedReturnValue: false
}) {
    options.loginRejectedReturnValue ?
        loginMock.mockRejectedValue(new Error(LOGIN_ERR_MSG)) :
        loginMock.mockResolvedValue();

    render(
        <MemoryRouter>
            <AlertContext.Provider value={{ setAlert }}>
                <LoginPage />
            </AlertContext.Provider>
        </MemoryRouter>
    )
}

describe("LoginPage component", () => {
    it("renders components with passed props", () => {

        setup();

        expect(screen.getByTestId("auth-header-title")).toHaveTextContent("Login");

        expect(screen.getByTestId("auth-button")).toHaveTextContent("Login");

        expect(screen.getByTestId("auth-nav-link")).toHaveAttribute("href", "/register");
        expect(screen.getByTestId("auth-nav-link")).toHaveTextContent("Don`t have an account?");

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

    it("authButton is not disabled on initial render", () => {
        setup();

        expect(screen.getByTestId("auth-button")).not.toBeDisabled();
    });

    it("authButton is disabled after form submit", async () => {
        setup();

        fireEvent.click(screen.getByTestId("auth-button"));

        await waitFor(() => expect(screen.getByTestId("auth-button")).toBeDisabled());
    });

    it("triggers login with form data on submit", async () => {
        setup();

        const PASSWORD_VALUE = "MySecretPassword!";
        const EMAIL_VALUE = "example@email.com";

        const inputs = screen.getAllByTestId("auth-forms-input");

        const emailInput = inputs.find(input => input.getAttribute("name") === "email");
        const passwordInput = inputs.find(input => input.getAttribute("name") === "password");

        fireEvent.change(emailInput, {target: {value: EMAIL_VALUE}});
        fireEvent.change(passwordInput, {target: {value: PASSWORD_VALUE}});

        fireEvent.click(screen.getByTestId("auth-button"));

        await waitFor(() => expect(loginMock).toHaveBeenCalledWith({
            email: EMAIL_VALUE,
            password: PASSWORD_VALUE,
        }));
    });

    it("tiggers setAlert on rejected login call", async () => {
        setup({
            loginRejectedReturnValue: true
        });

        fireEvent.click(screen.getByTestId("auth-button"))

        await waitFor(() => expect(setAlert).toHaveBeenCalledWith(LOGIN_ERR_MSG));
    });
});