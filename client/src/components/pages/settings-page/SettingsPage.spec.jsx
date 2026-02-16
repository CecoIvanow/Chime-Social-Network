import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../contexts/alert-context";
import { UserContext } from "../../../contexts/user-context";

import SettingsPage from "./SettingsPage";

vi.mock("react-router", () => ({
    useNavigate: () => reactRouterMock.navigateTo
}));

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({
        ...useUserServicesMock
    })
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

const isUser = "userId";

const userData = {
    email: "example@email.com"
};

const reactRouterMock = {
    navigateTo: vi.fn(),
}

const useUserServicesMock = {
    abortAll: vi.fn(),
    changeUserEmail: vi.fn(),
    changeUserPassword: vi.fn(),
    getUserFields: vi.fn(),
}

const setAlert = vi.fn();

function setup(
    options = {
        getUserFieldsResolved: true,
        changeUserPasswordResolved: true,
        changeUserEmailResolvedCall: true,
        changeUserPasswordEmptyReturn: false,
        changeUserEmailEmptyReturn: false,
    }
) {
    if (options.changeUserEmailEmptyReturn) {
        useUserServicesMock.changeUserEmail.mockResolvedValue(null);
    } else if (!options.changeUserEmailResolvedCall) {
        useUserServicesMock.changeUserEmail.mockRejectedValue(new Error("Successfully rejected changeUserEmail!"));
    } else {
        useUserServicesMock.changeUserEmail.mockResolvedValue(userData);
    };

    if (options.changeUserPasswordEmptyReturn) {
        useUserServicesMock.changeUserPassword.mockResolvedValue(null);
    } else if (!options.changeUserPasswordResolved) {
        useUserServicesMock.changeUserPassword.mockRejectedValue(new Error("Successfully rejected changeUserPassword!"));
    } else {
        useUserServicesMock.changeUserPassword.mockResolvedValue(true);
    };

    options.getUserFieldsResolved ?
        useUserServicesMock.getUserFields.mockResolvedValue(userData) :
        useUserServicesMock.getUserFields.mockRejectedValue(new Error("Successfully rejected getUserFields!"));

    return render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <SettingsPage />
            </UserContext.Provider>
        </AlertContext.Provider>
    );
};

describe("SettingsPage component", () => {
    it("renders password change form and passes props", async () => {
        setup();

        expect(screen.getByTestId("password-form")).toBeInTheDocument();
        expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();

        fireEvent.submit(screen.getByTestId("password-form"));

        await waitFor(() => {
            expect(useUserServicesMock.changeUserPassword).toHaveBeenCalled();
            expect(reactRouterMock.navigateTo).toHaveBeenCalledWith(`/profile/${isUser}`);
        });
    });

    it("does not navigate when changeUserPassword returns false", async () => {
        setup({
            getUserFieldsResolved: true,
            changeUserPasswordResolved: true,
            changeUserEmailResolvedCall: true,
            changeUserPasswordEmptyReturn: true,
            changeUserEmailEmptyReturn: false,
        });

        fireEvent.submit(screen.getByTestId("password-form"));

        await waitFor(() => {
            expect(useUserServicesMock.changeUserPassword).toHaveBeenCalled();
            expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();
            expect(setAlert).not.toHaveBeenCalled();
        });
    });

    it("triggers set alert on rejected user password change", async () => {
        setup({
            getUserFieldsResolved: true,
            changeUserPasswordResolved: false,
            changeUserEmailResolvedCall: true,
            changeUserPasswordEmptyReturn: false,
            changeUserEmailEmptyReturn: false,
        });

        expect(screen.getByTestId("password-form")).toBeInTheDocument();
        expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();

        fireEvent.submit(screen.getByTestId("password-form"));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalled();
        });
    });

    it("renders email change form and passes props", async () => {
        const emailPattern = new RegExp(`^${userData.email}$`);

        setup();

        expect(screen.getByTestId("email-form")).toBeInTheDocument();
        expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();

        fireEvent.submit(screen.getByTestId("email-form"));

        await waitFor(() => {
            expect(useUserServicesMock.changeUserEmail).toHaveBeenCalled();
            expect(reactRouterMock.navigateTo).toHaveBeenCalledWith(`/profile/${isUser}`);
            expect(screen.getByTestId("user-email")).toHaveTextContent(emailPattern);
        });
    });

    it("does not navigate when changeUserEmail returns false", async () => {
        setup({
            getUserFieldsResolved: true,
            changeUserPasswordResolved: true,
            changeUserEmailResolvedCall: true,
            changeUserPasswordEmptyReturn: false,
            changeUserEmailEmptyReturn: true,
        });

        fireEvent.submit(screen.getByTestId("email-form"));

        await waitFor(() => {
            expect(useUserServicesMock.changeUserEmail).toHaveBeenCalled();
            expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();
            expect(setAlert).not.toHaveBeenCalled();
        });
    });

    it("triggers set alert on rejected user email change", async () => {
        setup({
            getUserFieldsResolved: true,
            changeUserPasswordResolved: true,
            changeUserEmailResolvedCall: false,
            changeUserPasswordEmptyReturn: false,
            changeUserEmailEmptyReturn: false,
        });

        expect(screen.getByTestId("email-form")).toBeInTheDocument();
        expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();

        fireEvent.submit(screen.getByTestId("email-form"));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalled();
        });
    });

    it("triggers set alert on rejected get user fields call", async () => {
        setup({
            getUserFieldsResolved: false,
            changeUserPasswordResolved: true,
            changeUserEmailResolvedCall: true,
            changeUserPasswordEmptyReturn: false,
            changeUserEmailEmptyReturn: false,
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledOnce();
            expect(screen.getByTestId("user-email")).toHaveTextContent('');
        });
    });

    it("triggers abortAll on unmount", async () => {
        const { unmount } = setup();

        unmount();
        await waitFor(() => {
            expect(useUserServicesMock.abortAll).toHaveBeenCalledOnce();
        });
    });
});