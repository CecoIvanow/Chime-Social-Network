import { Link, MemoryRouter } from "react-router";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../contexts/alert-context";

import RegisterPage from "./RegisterPage";

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({
        ...useUserServicesMock
    })
}));

vi.mock("../../ui/auth/auth-button/AuthButton", () => ({
    default: ({ buttonText, isPending }) => <button disabled={isPending}>{buttonText}</button>
}));

vi.mock("../../ui/auth/auth-nav-link/AuthNavLink", () => ({
    default: ({ path, buttonText }) => <Link to={path}>{buttonText}</Link>
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
        useUserServicesMock.register.mockRejectedValue(new Error(ERR_MSG.REGISTER))
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
    it("renders AuthHeaderTitle with passed prop", () => {
        const pattern = /^Register$/;

        setup();

        expect(screen.getByTestId("header-title")).toHaveTextContent(pattern);
    });

    it("renders GenderDetails", () => {
        setup();

        expect(screen.getByTestId("gender-details")).toBeInTheDocument();
    });

    it("renders AuthNavLink with passed props", () => {
        setup();

        expect(screen.getByRole("link", { name: "Already have an account?" })).toHaveAttribute("href", "/login")
    });

    it("renders AuthFormsList with passed props", () => {
        setup();

        for (let i = 0; i < registerFields.length; i++) {
            expect(screen.getByLabelText(registerFields[i].fieldName)).toHaveAttribute("type", registerFields[i].inputType);
            expect(screen.getByLabelText(registerFields[i].fieldName)).toHaveAttribute("placeholder", registerFields[i].placeholderText);
        };
    });

    it("renders AuthButton enabled with passed props", () => {
        setup();

        expect(screen.getByRole("button", { name: "Register" })).not.toBeDisabled();
    });

    it("renders AuthButton disabled with passed props on submitted form", () => {
        setup();

        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        expect(screen.getByRole("button", { name: "Register" })).toBeDisabled();
    });

    it("on form submit triggers register method with successfull call", async () => {
        setup();

        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        await waitFor(() => {
            expect(useUserServicesMock.register).toHaveBeenCalled();
        });
    });

    it("on form submit triggers setAlert on rejected register method call", async () => {
        setup({
            registerRejectedCall: true
        });

        fireEvent.click(screen.getByRole("button", { name: "Register" }));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalled();
        });
    });

    it("triggers abortAll on unmount", () => {
        const { unmount } = setup();

        unmount();
        expect(useUserServicesMock.abortAll).toHaveBeenCalled();
    });
});