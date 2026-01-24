import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, should } from "vitest";

import { AlertContext } from "./contexts/alert-context";
import { UserContext } from "./contexts/user-context";

import App from "./App";
import { MemoryRouter } from "react-router";

vi.mock("./hooks/usePersistedState.js", () => ({
    default: () => userPersistedStateMock
}));

vi.mock("./components/layout/menu-bar/MenuBar.jsx", () => ({
    default: () => (
        <AlertContext.Consumer>
            {({ setAlert }) => (
                <div onClick={() => setAlert(true)} data-testid="menu-bar"></div>
            )}
        </AlertContext.Consumer>
    )
}));

vi.mock("./components/pages/landing-page/LandingPage.jsx", () => ({
    default: () => <div data-testid="landing-page"></div>
}));

vi.mock("./components/pages/user-home-page/UserHomePage.jsx", () => ({
    default: () => <div data-testid="user-home-page"></div>
}));

vi.mock("./components/pages/login-page/LoginPage.jsx", () => ({
    default: () => <div data-testid="login-page"></div>
}));

vi.mock("./components/pages/register-page/RegisterPage.jsx", () => ({
    default: () => <div data-testid="register-page"></div>
}));

vi.mock("./components/pages/not-found-page/NotFoundPage.jsx", () => ({
    default: () => <div data-testid="not-found-page"></div>
}));

vi.mock("./components/pages/catalog-page/CatalogPage.jsx", () => ({
    default: () => <div data-testid="catalog-page"></div>
}));

vi.mock("./components/pages/settings-page/SettingsPage.jsx", () => ({
    default: () => <div data-testid="settings-page"></div>
}));

vi.mock("./components/pages/profile-page/ProfilePage.jsx", () => ({
    default: () => <div data-testid="profile-page"></div>
}));

vi.mock("./components/pages/logout/Logout.jsx", () => ({
    default: () => <div data-testid="logout"></div>
}));

vi.mock("./components/pages/post-details-page/PostDetailsPage.jsx", () => ({
    default: () => <div data-testid="post-details-page"></div>
}));

vi.mock("./components/pages/profile-edit-page/ProfileEditPage.jsx", () => ({
    default: () => <div data-testid="profile-edit-page"></div>
}));

vi.mock("./components/pages/post-edit-redirect/PostEditRedirect.jsx", () => ({
    default: () => <div data-testid="post-edit-redirect"></div>
}));

vi.mock("./components/ui/alert-notification/AlertNotification.jsx", () => ({
    default: () => <div data-testid="alert-notification"></div>
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
    isUserIsValid: true,
    initialEntries: "/",
}) {

    userPersistedStateMock[0] = options.isUserIsValid ? USER_ID : null;

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
        { name: "renders MenuBar on valid isUser", isUserIsValid: true, initialEntries: "/login", shouldRender: true },
        { name: "renders MenuBar on empty isUser and location.pathname not equal to '/'", isUserIsValid: false, initialEntries: "/login", shouldRender: true },
        { name: "does not render MenuBar on empty isUser and location.pathname equal to '/'", isUserIsValid: false, initialEntries: "/", shouldRender: false },
    ])("$name", ({ isUserIsValid, initialEntries, shouldRender }) => {
        setup({
            isUserIsValid,
            initialEntries,
        });

        if (shouldRender) {
            expect(screen.getByTestId("menu-bar")).toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("menu-bar")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders UserHomePage and not LandingPage on valid isUser and route '/'", isUserIsValid: true },
        { name: "renders LandingPage and not UserHomePage on null isUser and route '/'", isUserIsValid: false },
    ])("$name", ({ isUserIsValid }) => {
        setup({
            initialEntries: "/",
            isUserIsValid,
        });

        if (isUserIsValid) {
            expect(screen.getByTestId("user-home-page")).toBeInTheDocument();
            expect(screen.queryByTestId("landing-page")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("landing-page")).toBeInTheDocument();
            expect(screen.queryByTestId("user-home-page")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders ProfileEditPage on valid isUser with route /profile/:userId/edit", isUserIsValid: true, shouldRender: true },
        { name: "does not render ProfileEditPage and redirects to /login on null isUser", isUserIsValid: false, shouldRender: false },
    ])("$name", ({ isUserIsValid, shouldRender }) => {
        setup({
            initialEntries: `/profile/${USER_ID}/edit`,
            isUserIsValid,
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
        { name: "renders PostEditRedirect on valid isUser with route /post/:userId/edit", isUserIsValid: true, shouldRender: true },
        { name: "does not render PostEditRedirect and redirects to /login on null isUser", isUserIsValid: false, shouldRender: false },
    ])("$name", ({ isUserIsValid, shouldRender }) => {
        setup({
            initialEntries: `/post/${POST_ID}/edit`,
            isUserIsValid,
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
        { name: "renders SettingsPage on valid isUser with route /settings", isUserIsValid: true, shouldRender: true },
        { name: "does not render SettingsPage and redirects to /login on null isUser", isUserIsValid: false, shouldRender: false },
    ])("$name", ({ isUserIsValid, shouldRender }) => {
        setup({
            initialEntries: "/settings",
            isUserIsValid,
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
        { name: "renders Logout on valid isUser with route /logout", isUserIsValid: true, shouldRender: true },
        { name: "does not render Logout and redirects to '/' on null isUser", isUserIsValid: false, shouldRender: false },
    ])("$name", ({ isUserIsValid, shouldRender }) => {
        setup({
            initialEntries: "/logout",
            isUserIsValid,
        });

        if (shouldRender) {
            expect(screen.getByTestId("logout")).toBeInTheDocument();
            expect(screen.queryByTestId("landing-page")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("landing-page")).toBeInTheDocument();
            expect(screen.queryByTestId("logout")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders RegisterPage on null isUser with route /register", isUserIsValid: true, shouldRender: true },
        { name: "does not render RegisterPage and redirects to '/' on valid isUser", isUserIsValid: false, shouldRender: false },
    ])("$name", ({ isUserIsValid, shouldRender }) => {
        setup({
            initialEntries: "/register",
            isUserIsValid,
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
        { name: "renders LoginPage on null isUser with route /login", isUserIsValid: true, shouldRender: true },
        { name: "does not render LoginPage and redirects to '/' on valid isUser", isUserIsValid: false, shouldRender: false },
    ])("$name", ({ isUserIsValid, shouldRender }) => {
        setup({
            initialEntries: "/login",
            isUserIsValid,
        });

        if (shouldRender) {
            expect(screen.getByTestId("user-home-page")).toBeInTheDocument();
            expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("login-page")).toBeInTheDocument();
            expect(screen.queryByTestId("user-home-page")).not.toBeInTheDocument();
        };
    });

    it("renders PostDetailsPage with route /post/:postId/details", () => {
        setup({
            initialEntries: `/post/${POST_ID}/details`,
            isUserIsValid: true,
        });

        expect(screen.getByTestId("post-details-page")).toBeInTheDocument();
    });

    it("renders ProfilePage with route /profile/:userId", () => {
        setup({
            initialEntries: `/profile/${USER_ID}`,
            isUserIsValid: true,
        });

        expect(screen.getByTestId("profile-page")).toBeInTheDocument();
    });

    it("renders CatalogPage with route /catalog", () => {
        setup({
            initialEntries: "/catalog",
            isUserIsValid: true,
        });

        expect(screen.getByTestId("catalog-page")).toBeInTheDocument();
    });

    it("renders NotFoundPage with unknown route", () => {
        setup({
            initialEntries: "/tires",
            isUserIsValid: true,
        });

        expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
    });

    it.each([
        { name: "does not render AlertNotification on null alert state", shouldRender: false },
        { name: "renders AlertNotification on valid alert state", shouldRender: true },
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