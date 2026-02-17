import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
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
            <button type="submit">Change Password</button>
        </form>
    </>
}));

vi.mock("./email-change-form/EmailChangeForm", () => ({
    default: ({ userEmail, onSubmitHandler }) => <>
        <div data-testid="user-email">{userEmail}</div>
        <form
            action={onSubmitHandler}
            data-testid="email-form"
            onSubmit={e => {
                e.preventDefault();
                onSubmitHandler(new FormData(e.target))
            }}
        >
            <button type="submit">Change Email</button>
        </form>
    </>
}));

const ERR_MSG = {
    CHANGE_EMAIL: "Rejected changeUserEmail!",
    CHANGE_PASSWORD: "Rejected changeUserPassword!",
    GET_USER_FIELDS: "Rejected getUserFields!"
}

const isUser = "userId";

const userData = {
    email: "example@email.com"
};

const setAlert = vi.fn();

const reactRouterMock = {
    navigateTo: vi.fn(),
}

const useUserServicesMock = {
    abortAll: vi.fn(),
    changeUserEmail: vi.fn(),
    changeUserPassword: vi.fn(),
    getUserFields: vi.fn(),
}

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
        useUserServicesMock.changeUserEmail.mockRejectedValue(new Error(ERR_MSG.CHANGE_EMAIL));
    } else {
        useUserServicesMock.changeUserEmail.mockResolvedValue(userData);
    };

    if (options.changeUserPasswordEmptyReturn) {
        useUserServicesMock.changeUserPassword.mockResolvedValue(null);
    } else if (!options.changeUserPasswordResolved) {
        useUserServicesMock.changeUserPassword.mockRejectedValue(new Error(ERR_MSG.CHANGE_PASSWORD));
    } else {
        useUserServicesMock.changeUserPassword.mockResolvedValue(true);
    };

    options.getUserFieldsResolved ?
        useUserServicesMock.getUserFields.mockResolvedValue(userData) :
        useUserServicesMock.getUserFields.mockRejectedValue(new Error(ERR_MSG.GET_USER_FIELDS));

    return render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <SettingsPage />
            </UserContext.Provider>
        </AlertContext.Provider>
    );
};

describe("SettingsPage component", () => {
    it("renders password change form", async () => {
        setup();

        expect(screen.getByTestId("password-form")).toBeInTheDocument();
    });

    it("renders email change form with correct user email on successfull user data call", async () => {
        setup();

        expect(screen.getByTestId("email-form")).toBeInTheDocument();
        expect(await screen.findByText(userData.email)).toBeInTheDocument();
    });

    it("shows an error message on rejected user data call", async () => {
        setup({
            getUserFieldsResolved: false,
            changeUserPasswordResolved: true,
            changeUserEmailResolvedCall: true,
            changeUserPasswordEmptyReturn: false,
            changeUserEmailEmptyReturn: false,
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.GET_USER_FIELDS);
        });
    });

    it("redirects to the user's profile on a successfull password change call", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Change Password" }));

        await waitFor(() => {
            expect(useUserServicesMock.changeUserPassword).toHaveBeenCalled();
        });
        expect(reactRouterMock.navigateTo).toHaveBeenCalledWith(`/profile/${isUser}`);
    });

    it("redirects to the user's profile on a successfull email change call", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Change Email" }));

        await waitFor(() => {
            expect(useUserServicesMock.changeUserEmail).toHaveBeenCalled();
        });
        expect(reactRouterMock.navigateTo).toHaveBeenCalledWith(`/profile/${isUser}`);
    });

    it("does nothing when the password change call does not succeed", async () => {
        const user = userEvent.setup();
        setup({
            getUserFieldsResolved: true,
            changeUserPasswordResolved: true,
            changeUserEmailResolvedCall: true,
            changeUserPasswordEmptyReturn: true,
            changeUserEmailEmptyReturn: false,
        });

        await user.click(screen.getByRole("button", { name: "Change Password" }));

        await waitFor(() => {
            expect(useUserServicesMock.changeUserPassword).toHaveBeenCalled();
        });
        expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();
    });

    it("shows an error message when the password change gets rejected", async () => {
        const user = userEvent.setup();
        setup({
            getUserFieldsResolved: true,
            changeUserPasswordResolved: false,
            changeUserEmailResolvedCall: true,
            changeUserPasswordEmptyReturn: false,
            changeUserEmailEmptyReturn: false,
        });

        await user.click(screen.getByRole("button", { name: "Change Password" }));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.CHANGE_PASSWORD);
        });
    });

    it("does nothing when the email change call does not succeed", async () => {
        const user = userEvent.setup();
        setup({
            getUserFieldsResolved: true,
            changeUserPasswordResolved: true,
            changeUserEmailResolvedCall: true,
            changeUserPasswordEmptyReturn: false,
            changeUserEmailEmptyReturn: true,
        });

        await user.click(screen.getByRole("button", { name: "Change Email" }));

        await waitFor(() => {
            expect(useUserServicesMock.changeUserEmail).toHaveBeenCalled();
        });
        expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();
    });

    it("shows an error message when the email change gets rejected", async () => {
        const user = userEvent.setup();
        setup({
            getUserFieldsResolved: true,
            changeUserPasswordResolved: true,
            changeUserEmailResolvedCall: false,
            changeUserPasswordEmptyReturn: false,
            changeUserEmailEmptyReturn: false,
        });

        await user.click(screen.getByRole("button", { name: "Change Email" }));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.CHANGE_EMAIL);
        });
    });

    it("stops all ongoing calls on unmount", async () => {
        const { unmount } = setup();

        unmount();
        expect(useUserServicesMock.abortAll).toHaveBeenCalled();
    });
});