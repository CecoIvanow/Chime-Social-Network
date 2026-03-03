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

vi.mock("./guards/home-page-guard/HomePageGuard", () => ({
    default: () => <div data-testid="home-page-guard"></div>
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
    isLoggedIn: true,
    initialEntries: "/",
}) {

    userPersistedStateMock[0] = options.isLoggedIn ? USER_ID : null;

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
        { name: "renders MenuBar on on logged in user", isLoggedIn: true, initialEntries: "/login", shouldRender: true },
        { name: "renders MenuBar on guest user and not being on the home page", isLoggedIn: false, initialEntries: "/login", shouldRender: true },
        { name: "does not render MenuBar on guest user being on the home page", isLoggedIn: false, initialEntries: "/", shouldRender: false },
    ])("$name", ({ isLoggedIn, initialEntries, shouldRender }) => {
        setup({
            isLoggedIn,
            initialEntries,
        });

        if (shouldRender) {
            expect(screen.getByTestId("menu-bar")).toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("menu-bar")).not.toBeInTheDocument();
        };
    });

    it("renders HomeGuardPage on user entry", ({ isLoggedIn }) => {
        setup({
            initialEntries: "/",
            isLoggedIn,
        });

        expect(screen.getByTestId("home-page-guard")).toBeInTheDocument();
    });

    it.each([
        { name: "renders ProfileEditPage on when the user is logged in and being in their profile edit page", isLoggedIn: true, shouldRender: true },
        { name: "does not render ProfileEditPage and redirects to login when the user is not logged in and trying to access a profile edit page", isLoggedIn: false, shouldRender: false },
    ])("$name", ({ isLoggedIn, shouldRender }) => {
        setup({
            initialEntries: `/profile/${USER_ID}/edit`,
            isLoggedIn,
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
        { name: "renders PostEditRedirect on logged in user and being in their post edit page", isLoggedIn: true, shouldRender: true },
        { name: "does not render PostEditRedirect on logged out user trying to access a post edit page", isLoggedIn: false, shouldRender: false },
    ])("$name", ({ isLoggedIn, shouldRender }) => {
        setup({
            initialEntries: `/post/${POST_ID}/edit`,
            isLoggedIn,
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
        { name: "renders SettingsPage on logged in user and being in their settings page", isLoggedIn: true, shouldRender: true },
        { name: "does not render SettingsPage and redirects to login page on logged out user trying to access settings page", isLoggedIn: false, shouldRender: false },
    ])("$name", ({ isLoggedIn, shouldRender }) => {
        setup({
            initialEntries: "/settings",
            isLoggedIn,
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
        { name: "renders Logout on a logged in user being in the logout page", isLoggedIn: true, shouldRender: true },
        { name: "does not render Logout and redirects to login page on logged out user trying to access the logout page", isLoggedIn: false, shouldRender: false },
    ])("$name", ({ isLoggedIn, shouldRender }) => {
        setup({
            initialEntries: "/logout",
            isLoggedIn,
        });

        if (shouldRender) {
            expect(screen.getByTestId("logout")).toBeInTheDocument();
        } else {
            expect(screen.getByTestId("login-page")).toBeInTheDocument();
            expect(screen.queryByTestId("logout")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders RegisterPage on logged out user being in the register page", isLoggedIn: false, shouldRender: true },
        { name: "does not render RegisterPage and redirects to home page on logged in user trying to access the register page", isLoggedIn: true, shouldRender: false },
    ])("$name", ({ isLoggedIn, shouldRender }) => {
        setup({
            initialEntries: "/register",
            isLoggedIn,
        });

        if (shouldRender) {
            expect(screen.getByTestId("register-page")).toBeInTheDocument();
            expect(screen.queryByTestId("home-page-guard")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("home-page-guard")).toBeInTheDocument();
            expect(screen.queryByTestId("register-page")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders LoginPage on logged out user being in the login page", isLoggedIn: false, shouldRender: true },
        { name: "does not render LoginPage and redirects to home page on logged out user trying to access the login page", isLoggedIn: true, shouldRender: false },
    ])("$name", ({ isLoggedIn, shouldRender }) => {
        setup({
            initialEntries: "/login",
            isLoggedIn,
        });

        if (shouldRender) {
            expect(screen.getByTestId("login-page")).toBeInTheDocument();
            expect(screen.queryByTestId("home-page-guard")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("home-page-guard")).toBeInTheDocument();
            expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
        };
    });

    it("renders PostDetailsPage when accessing the post details page", () => {
        setup({
            initialEntries: `/post/${POST_ID}/details`,
            isLoggedIn: true,
        });

        expect(screen.getByTestId("post-details-page")).toBeInTheDocument();
    });

    it("renders ProfilePage when accessing a profile page", () => {
        setup({
            initialEntries: `/profile/${USER_ID}`,
            isLoggedIn: true,
        });

        expect(screen.getByTestId("profile-page")).toBeInTheDocument();
    });

    it("renders CatalogPage when accessing the catalog page", () => {
        setup({
            initialEntries: "/catalog",
            isLoggedIn: true,
        });

        expect(screen.getByTestId("catalog-page")).toBeInTheDocument();
    });

    it("renders NotFoundPage when trying to access an invalid page", () => {
        setup({
            initialEntries: "/tires",
            isLoggedIn: true,
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