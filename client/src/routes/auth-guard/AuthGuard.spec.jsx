import { MemoryRouter, Route, Routes } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { UserContext } from "../../contexts/user-context";

import AuthGuard from "./AuthGuard";

function setup(options = {
    loggedInUserId: false,
}) {
    render(
        <UserContext.Provider value={{ ...options }}>
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    <Route element={<AuthGuard />} >
                        <Route path="/protected" element={<div data-testid="protected-page"></div>} />
                    </Route>

                    <Route path="/login" element={<div data-testid="login-page"></div>} />
                </Routes>
            </MemoryRouter>
        </UserContext.Provider>
    );
}

describe("AuthGuard component", () => {
    it.each([
        { name: "on logged out user does not render the children components and navigates to login page", loggedInUserId: false },
        { name: "on logged in user does not navigate to login page and renders the children components", loggedInUserId: "342ed" },
    ])("$name", ({ loggedInUserId }) => {
        setup({
            loggedInUserId,
        });

        if (loggedInUserId) {
            expect(screen.getByTestId("protected-page")).toBeInTheDocument();
            expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("protected-page")).not.toBeInTheDocument();
            expect(screen.getByTestId("login-page")).toBeInTheDocument();
        }
    });
});