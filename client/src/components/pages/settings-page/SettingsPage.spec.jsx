import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SettingsPage from "./SettingsPage";

import { useNavigate } from "react-router";

import { AlertContext } from "../../../contexts/alert-context";
import { UserContext } from "../../../contexts/user-context";

import useUserServices from "../../../hooks/useUserServices";

vi.mock("./password-change-form/PasswordChangeForm", () => ({
    default: ({ onSubmitHandler }) => <>
        <form action={onSubmitHandler} data-testid="password-form">
            <button data-testid="password-submit-button">Submit Pass</button>;
        </form>
    </>
}));

vi.mock("./email-change-form/EmailChangeForm", () => ({
    default: ({ userEmail, onSubmitHandler }) => <>
        <form action={onSubmitHandler} data-testid="email-form">
            <div data-testid="user-email">{userEmail}</div>
            <button data-testid="email-submit-button">Submit Email</button>;
        </form>
    </>
}));

vi.mock("../../../hooks/useUserServices");

vi.mock("react-router");

describe("SettingsPage component", () => {
    const userData = { email: "example@email.com" };

    const isUser = "userId";
    const navigateTo = vi.fn();
    const setAlert = vi.fn();
    const abortAll = vi.fn();

    function renderComp(
        isGetUserFieldsMockResolved = true,
        isChangeUserPasswordMockResolved = true,
        isChangeUserEmailMockResolved = true
    ) {

        const getUserFieldsMock = isGetUserFieldsMockResolved ?
            vi.fn().mockResolvedValue(userData) :
            vi.fn().mockRejectedValue(new Error("Successfully rejected getUserFields!"));

        useNavigate.mockReturnValue(navigateTo);

        const changeUserPasswordMock = isChangeUserPasswordMockResolved ?
            vi.fn().mockResolvedValue(true) :
            vi.fn().mockRejectedValue(new Error("Successfully rejected changeUserPassword!"));

        const changeUserEmailMock = isChangeUserEmailMockResolved ?
            vi.fn().mockResolvedValue(true) :
            vi.fn().mockRejectedValue(new Error("Successfully rejected changeUserEmail!"));

        useUserServices.mockReturnValue(({
            changeUserEmail: changeUserEmailMock,
            changeUserPassword: changeUserPasswordMock,
            getUserFields: getUserFieldsMock,
            abortAll,
        }))

        const { unmount } = render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <SettingsPage />
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        return unmount
    };

    it("renders password change form and passes props", async () => {
        renderComp();

        expect(screen.getByTestId("password-form")).toBeInTheDocument();
        expect(navigateTo).not.toHaveBeenCalled();

        fireEvent.click(screen.getByTestId("password-submit-button"));

        await waitFor(() => {
            expect(navigateTo).toHaveBeenCalledWith(`/profile/${isUser}`);
        });
    });

    it("triggers set alert on rejected user password change", async () => {
        renderComp(true, false);

        expect(screen.getByTestId("password-form")).toBeInTheDocument();
        expect(navigateTo).not.toHaveBeenCalled();

        fireEvent.click(screen.getByTestId("password-submit-button"));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledOnce();
        });
    });

    it("renders password change form and passes props", async () => {
        const emailPattern = new RegExp(`^${userData.email}$`)

        renderComp();

        expect(screen.getByTestId("email-form")).toBeInTheDocument();
        expect(navigateTo).not.toHaveBeenCalled();

        fireEvent.click(screen.getByTestId("email-submit-button"));

        await waitFor(() => {
            expect(navigateTo).toHaveBeenCalledWith(`/profile/${isUser}`);
            expect(screen.getByTestId("user-email")).toHaveTextContent(emailPattern);
        });
    });

    it("triggers set alert on rejected user email change", async () => {
        renderComp(true, true, false);

        expect(screen.getByTestId("email-form")).toBeInTheDocument();
        expect(navigateTo).not.toHaveBeenCalled();

        fireEvent.click(screen.getByTestId("email-submit-button"));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledOnce();
        });
    });

    it("triggers set alert on rejected get user fields call", async () => {
        renderComp(false);

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledOnce();
            expect(screen.getByTestId("user-email")).toHaveTextContent('');
        });
    });

    it("triggers abort all on unmount", async () => {
        const unmount = renderComp();

        unmount();

        await waitFor(() => {
            expect(abortAll).toHaveBeenCalledOnce();
        })
    })
});