import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../contexts/user-context";

import HomePageGuard from "./HomePageGuard";

vi.mock("../../components/pages/user-home-page/UserHomePage", () => ({
    default: () => <div data-testid="user-home-page"></div>
}));

vi.mock("../../components/pages/landing-page/LandingPage", () => ({
    default: () => <div data-testid="landing-page"></div>
}));

function setup(options = {
    isLoggedIn: false,
}) {
    render(
        <UserContext.Provider value={{ loggedInUserId: options.isLoggedIn }}>
            <HomePageGuard />
        </UserContext.Provider>
    );
}

describe("HomePageGuard component", () => {
    it("renders LandingPage on logged out user", () => {
        setup();

        expect(screen.queryByTestId("landing-page")).toBeInTheDocument();
    });

    it("renders UserHomePage on logged in user", () => {
        setup({
            isLoggedIn: true,
        });

        expect(screen.getByTestId("user-home-page")).toBeInTheDocument();
    });
});