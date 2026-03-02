import { MemoryRouter } from "react-router";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "./contexts/alert-context";

import App from "./App";
import { useContext } from "react";

vi.mock("./hooks/usePersistedState.js", () => ({
    default: () => userPersistedStateMock
}));

vi.mock("./components/layout/menu-bar/MenuBar.jsx", () => ({
    default: function MenuBar() {
        const { setAlert } = useContext(AlertContext);

        return (
            <div onClick={() => setAlert(true)} data-testid="menu-bar"></div>
        );
    }
}));

vi.mock("./components/ui/alert-notification/AlertNotification.jsx", () => ({
    default: () => <div data-testid="alert-notification"></div>
}));

vi.mock("./components/pages/user-home-page/UserHomePage.jsx", () => ({
    default: () => <div data-testid="user-home-page"></div>
}));

vi.mock("./components/pages/landing-page/LandingPage.jsx", () => ({
    default: () => <div data-testid="landing-page"></div>
}));

vi.mock("./components/pages/profile-edit-page/ProfileEditPage.jsx", () => ({
    default: () => <div data-testid="profile-edit-page"></div>
}));

vi.mock("./components/pages/post-edit-redirect/PostEditRedirect.jsx", () => ({
    default: () => <div data-testid="post-edit-redirect"></div>
}));

vi.mock("./components/pages/settings-page/SettingsPage.jsx", () => ({
    default: () => <div data-testid="settings-page"></div>
}));

vi.mock("./components/pages/logout/Logout.jsx", () => ({
    default: () => <div data-testid="logout"></div>
}));

vi.mock("./components/pages/register-page/RegisterPage.jsx", () => ({
    default: () => <div data-testid="register-page"></div>
}));

vi.mock("./components/pages/login-page/LoginPage.jsx", () => ({
    default: () => <div data-testid="login-page"></div>
}));

vi.mock("./components/pages/post-details-page/PostDetailsPage.jsx", () => ({
    default: () => <div data-testid="post-details-page"></div>
}));

vi.mock("./components/pages/profile-page/ProfilePage.jsx", () => ({
    default: () => <div data-testid="profile-page"></div>
}));

vi.mock("./components/pages/catalog-page/CatalogPage.jsx", () => ({
    default: () => <div data-testid="catalog-page"></div>
}));

vi.mock("./components/pages/not-found-page/NotFoundPage.jsx", () => ({
    default: () => <div data-testid="not-found-page"></div>
}));

vi.mock("./components/layout/error-boundary/ErrorBoundary.jsx", () => ({
    default: ({ children }) => <div data-testid="error-boundary">{children}</div>
}));

const USER_ID = "userId";
const POST_ID = "postId";

const userPersistedStateMock = [
    USER_ID,
    vi.fn(),
];

function setup(options = {
    loggedInUserIdIsValid: true,
    initialEntries: "/",
}) {

    userPersistedStateMock[0] = options.loggedInUserIdIsValid ? USER_ID : null;

    render(
        <MemoryRouter initialEntries={[options.initialEntries]}>
            <App />
        </MemoryRouter>
    );
};

describe("App component", () => {
    it("renders ErrorBoundary and its children", () => {
        setup();

        expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
        expect(screen.getByTestId("menu-bar")).toBeInTheDocument();
    })

    it.each([
        { name: "renders MenuBar on on logged in user", loggedInUserIdIsValid: true, initialEntries: "/login", shouldRender: true },
        { name: "renders MenuBar on guest user and not being on the home page", loggedInUserIdIsValid: false, initialEntries: "/login", shouldRender: true },
        { name: "does not render MenuBar on guest user being on the home page", loggedInUserIdIsValid: false, initialEntries: "/", shouldRender: false },
    ])("$name", ({ loggedInUserIdIsValid, initialEntries, shouldRender }) => {
        setup({
            loggedInUserIdIsValid,
            initialEntries,
        });

        if (shouldRender) {
            expect(screen.getByTestId("menu-bar")).toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("menu-bar")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders UserHomePage and not LandingPage on logged in user being on the home page", loggedInUserIdIsValid: true },
        { name: "renders LandingPage and not UserHomePage on logged out user being on the home page", loggedInUserIdIsValid: false },
    ])("$name", ({ loggedInUserIdIsValid }) => {
        setup({
            initialEntries: "/",
            loggedInUserIdIsValid,
        });

        if (loggedInUserIdIsValid) {
            expect(screen.getByTestId("user-home-page")).toBeInTheDocument();
            expect(screen.queryByTestId("landing-page")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("landing-page")).toBeInTheDocument();
            expect(screen.queryByTestId("user-home-page")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders ProfileEditPage on when the user is logged in and being in their profile edit page", loggedInUserIdIsValid: true, shouldRender: true },
        { name: "does not render ProfileEditPage and redirects to login when the user is not logged in and trying to access a profile edit page", loggedInUserIdIsValid: false, shouldRender: false },
    ])("$name", ({ loggedInUserIdIsValid, shouldRender }) => {
        setup({
            initialEntries: `/profile/${USER_ID}/edit`,
            loggedInUserIdIsValid,
        });

        if (shouldRender) {
            expect(screen.getByTestId("profile-edit-page")).toBeInTheDocument();
            expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("login-page")).toBeInTheDocument();
            expect(screen.queryByTestId("profile-edit-page")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders PostEditRedirect on logged in user and being in their post edit page", loggedInUserIdIsValid: true, shouldRender: true },
        { name: "does not render PostEditRedirect on logged out user trying to access a post edit page", loggedInUserIdIsValid: false, shouldRender: false },
    ])("$name", ({ loggedInUserIdIsValid, shouldRender }) => {
        setup({
            initialEntries: `/post/${POST_ID}/edit`,
            loggedInUserIdIsValid,
        });

        if (shouldRender) {
            expect(screen.getByTestId("post-edit-redirect")).toBeInTheDocument();
            expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("login-page")).toBeInTheDocument();
            expect(screen.queryByTestId("post-edit-redirect")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders SettingsPage on logged in user and being in their settings page", loggedInUserIdIsValid: true, shouldRender: true },
        { name: "does not render SettingsPage and redirects to login page on logged out user trying to access settings page", loggedInUserIdIsValid: false, shouldRender: false },
    ])("$name", ({ loggedInUserIdIsValid, shouldRender }) => {
        setup({
            initialEntries: "/settings",
            loggedInUserIdIsValid,
        });

        if (shouldRender) {
            expect(screen.getByTestId("settings-page")).toBeInTheDocument();
            expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("login-page")).toBeInTheDocument();
            expect(screen.queryByTestId("settings-page")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders Logout on a logged in user being in the logout page", loggedInUserIdIsValid: true, shouldRender: true },
        { name: "does not render Logout and redirects to login page on logged out user trying to access the logout page", loggedInUserIdIsValid: false, shouldRender: false },
    ])("$name", ({ loggedInUserIdIsValid, shouldRender }) => {
        setup({
            initialEntries: "/logout",
            loggedInUserIdIsValid,
        });

        if (shouldRender) {
            expect(screen.getByTestId("logout")).toBeInTheDocument();
            expect(screen.queryByTestId("landing-page")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("login-page")).toBeInTheDocument();
            expect(screen.queryByTestId("logout")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders RegisterPage on logged out user being in the register page", loggedInUserIdIsValid: true, shouldRender: true },
        { name: "does not render RegisterPage and redirects to home page on logged in user trying to access the register page", loggedInUserIdIsValid: false, shouldRender: false },
    ])("$name", ({ loggedInUserIdIsValid, shouldRender }) => {
        setup({
            initialEntries: "/register",
            loggedInUserIdIsValid,
        });

        if (shouldRender) {
            expect(screen.getByTestId("user-home-page")).toBeInTheDocument();
            expect(screen.queryByTestId("register-page")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("register-page")).toBeInTheDocument();
            expect(screen.queryByTestId("user-home-page")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders LoginPage on logged out user being in the login page", loggedInUserIdIsValid: true, shouldRender: true },
        { name: "does not render LoginPage and redirects to home page on logged out user trying to access the login page", loggedInUserIdIsValid: false, shouldRender: false },
    ])("$name", ({ loggedInUserIdIsValid, shouldRender }) => {
        setup({
            initialEntries: "/login",
            loggedInUserIdIsValid,
        });

        if (shouldRender) {
            expect(screen.getByTestId("user-home-page")).toBeInTheDocument();
            expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("login-page")).toBeInTheDocument();
            expect(screen.queryByTestId("user-home-page")).not.toBeInTheDocument();
        };
    });

    it("renders PostDetailsPage when accessing the post details page", () => {
        setup({
            initialEntries: `/post/${POST_ID}/details`,
            loggedInUserIdIsValid: true,
        });

        expect(screen.getByTestId("post-details-page")).toBeInTheDocument();
    });

    it("renders ProfilePage when accessing a profile page", () => {
        setup({
            initialEntries: `/profile/${USER_ID}`,
            loggedInUserIdIsValid: true,
        });

        expect(screen.getByTestId("profile-page")).toBeInTheDocument();
    });

    it("renders CatalogPage when accessing the catalog page", () => {
        setup({
            initialEntries: "/catalog",
            loggedInUserIdIsValid: true,
        });

        expect(screen.getByTestId("catalog-page")).toBeInTheDocument();
    });

    it("renders NotFoundPage when trying to access an invalid page", () => {
        setup({
            initialEntries: "/tires",
            loggedInUserIdIsValid: true,
        });

        expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
    });

    it.each([
        { name: "does not render AlertNotification on no alerts present", shouldRender: false },
        { name: "renders AlertNotification when alerts are present", shouldRender: true },
    ])("$name", async ({ shouldRender }) => {
        setup();

        if (shouldRender) {
            expect(screen.queryByTestId("alert-notification")).not.toBeInTheDocument();

            fireEvent.click(screen.getByTestId("menu-bar"));

            expect(await screen.findByTestId("alert-notification")).toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("alert-notification")).not.toBeInTheDocument();
        }
    });
});