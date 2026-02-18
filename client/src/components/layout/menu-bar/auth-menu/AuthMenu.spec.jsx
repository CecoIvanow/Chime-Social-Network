import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AuthMenu from "./AuthMenu";
import { UserContext } from "../../../../contexts/user-context";

vi.mock("./user-auth-menu/UserAuthMenu", () => ({
    default: () => <div data-testid="user-auth-menu"></div>
}));

vi.mock("./guest-auth-menu/GuestAuthMenu", () => ({
    default: () => <div data-testid="guest-auth-menu"></div>
}));

function setup(options={
    isLogged: true,
}) {
    const isUser = options.isLogged ?
        "userId" :
        null;

    render(
        <UserContext.Provider value={{ isUser }}>
            <AuthMenu />
        </UserContext.Provider>
    );
}

describe("AuthMenu component", () => {
    it("renders user menu on logged user instead of guest menu", () => {
        setup();

        expect(screen.getByTestId("user-auth-menu")).toBeInTheDocument();
        expect(screen.queryByTestId("guest-auth-menu")).not.toBeInTheDocument();
    });

    it("renders guest menu on logged out user instead of user menu", () => {
        setup({
            isLogged: false,
        });

        expect(screen.getByTestId("guest-auth-menu")).toBeInTheDocument();
        expect(screen.queryByTestId("user-auth-menu")).not.toBeInTheDocument();
    });
});