import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import useUserServices from "../../../hooks/useUserServices";

import { AlertContext } from "../../../contexts/alert-context";
import { UserContext } from "../../../contexts/user-context";

import SettingsPage from "./SettingsPage";

vi.mock("../../../hooks/useUserServices");

vi.mock("react-router", () => ({
    useNavigate: () => reactRouterMock.navigateTo
}));

vi.mock("./password-change-form/PasswordChangeForm", () => ({
    default: ({ onSubmitHandler }) => <>
        <form
            action={onSubmitHandler}
            data-testid="password-form"
            onSubmit={e => {
                e.preventDefault();
                onSubmitHandler(new FormData(e.target))
            }}
        >
        </form>
    </>
}));

vi.mock("./email-change-form/EmailChangeForm", () => ({
    default: ({ userEmail, onSubmitHandler }) => <>
        <form
            action={onSubmitHandler}
            data-testid="email-form"
            onSubmit={e => {
                e.preventDefault();
                onSubmitHandler(new FormData(e.target))
            }}
        >
            <div data-testid="user-email">{userEmail}</div>
        </form>
    </>
}));

const userData = {
    email: "example@email.com"
};

const reactRouterMock = {
    navigateTo: vi.fn(),
}

const isUser = "userId";
const setAlert = vi.fn();
const abortAll = vi.fn();

function renderComp(
    options = {
        getUserFieldsMockResolved: true,
        changeUserPasswordMockResolved: true,
        changeUserEmailMockResolved: true,
        changeUserPasswordReturnValue: true,
        changeUserEmailReturnValue: true,
    }
) {

    const getUserFieldsMock = options.getUserFieldsMockResolved ?
        vi.fn().mockResolvedValue(userData) :
        vi.fn().mockRejectedValue(new Error("Successfully rejected getUserFields!"));

    const changeUserPasswordMock = options.changeUserPasswordMockResolved ?
        vi.fn().mockResolvedValue(options.changeUserPasswordReturnValue) :
        vi.fn().mockRejectedValue(new Error("Successfully rejected changeUserPassword!"));

    const changeUserEmailMock = options.changeUserEmailMockResolved ?
        vi.fn().mockResolvedValue(options.changeUserEmailReturnValue) :
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

    return { unmount, changeUserEmailMock, changeUserPasswordMock };
};

describe("SettingsPage component", () => {
    it("renders password change form and passes props", async () => {
        const { changeUserPasswordMock } = renderComp();

        expect(screen.getByTestId("password-form")).toBeInTheDocument();
        expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();

        fireEvent.submit(screen.getByTestId("password-form"));

        await waitFor(() => {
            expect(changeUserPasswordMock).toHaveBeenCalled();
            expect(reactRouterMock.navigateTo).toHaveBeenCalledWith(`/profile/${isUser}`);
        });
    });

    it("does not navigate when changeUserPassword returns false", async () => {
        const { changeUserPasswordMock } = renderComp({
            getUserFieldsMockResolved: true,
            changeUserPasswordMockResolved: true,
            changeUserEmailMockResolved: true,
            changeUserPasswordReturnValue: false,
            changeUserEmailReturnValue: true,
        });

        fireEvent.submit(screen.getByTestId("password-form"));

        await waitFor(() => {
            expect(changeUserPasswordMock).toHaveBeenCalled();
            expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();
            expect(setAlert).not.toHaveBeenCalled();
        });
    });

    it("triggers set alert on rejected user password change", async () => {
        renderComp({
            getUserFieldsMockResolved: true,
            changeUserPasswordMockResolved: false,
            changeUserEmailMockResolved: true,
            changeUserPasswordReturnValue: true,
            changeUserEmailReturnValue: true,
        });

        expect(screen.getByTestId("password-form")).toBeInTheDocument();
        expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();

        fireEvent.submit(screen.getByTestId("password-form"));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledOnce();
        });
    });

    it("renders email change form and passes props", async () => {
        const emailPattern = new RegExp(`^${userData.email}$`);

        const { changeUserEmailMock } = renderComp();

        expect(screen.getByTestId("email-form")).toBeInTheDocument();
        expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();

        fireEvent.submit(screen.getByTestId("email-form"));

        await waitFor(() => {
            expect(changeUserEmailMock).toHaveBeenCalled();
            expect(reactRouterMock.navigateTo).toHaveBeenCalledWith(`/profile/${isUser}`);
            expect(screen.getByTestId("user-email")).toHaveTextContent(emailPattern);
        });
    });

    it("does not navigate when changeUserEmail returns false", async () => {
        const { changeUserEmailMock } = renderComp({
            getUserFieldsMockResolved: true,
            changeUserPasswordMockResolved: true,
            changeUserEmailMockResolved: true,
            changeUserPasswordReturnValue: true,
            changeUserEmailReturnValue: false,
        });

        fireEvent.submit(screen.getByTestId("email-form"));

        await waitFor(() => {
            expect(changeUserEmailMock).toHaveBeenCalled();
            expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();
            expect(setAlert).not.toHaveBeenCalled();
        });
    });

    it("triggers set alert on rejected user email change", async () => {
        renderComp({
            getUserFieldsMockResolved: true,
            changeUserPasswordMockResolved: true,
            changeUserEmailMockResolved: false,
            changeUserPasswordReturnValue: true,
            changeUserEmailReturnValue: true,
        });

        expect(screen.getByTestId("email-form")).toBeInTheDocument();
        expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();

        fireEvent.submit(screen.getByTestId("email-form"));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledOnce();
        });
    });

    it("triggers set alert on rejected get user fields call", async () => {
        renderComp({
            getUserFieldsMockResolved: false,
            changeUserPasswordMockResolved: true,
            changeUserEmailMockResolved: true,
            changeUserPasswordReturnValue: true,
            changeUserEmailReturnValue: true,
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledOnce();
            expect(screen.getByTestId("user-email")).toHaveTextContent('');
        });
    });

    it("triggers abortAll on unmount", async () => {
        const { unmount } = renderComp();

        unmount();

        await waitFor(() => {
            expect(abortAll).toHaveBeenCalledOnce();
        });
    });
});