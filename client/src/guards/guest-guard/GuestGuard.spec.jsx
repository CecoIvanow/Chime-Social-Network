import { MemoryRouter, Route, Routes } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { UserContext } from "../../contexts/user-context";

import GuestGuard from "./GuestGuard";

function setup(options = {
    loggedInUserId: false,
}) {
    render(
        <UserContext.Provider value={{ ...options }}>
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    <Route element={<GuestGuard />} >
                        <Route path="/protected" element={<div data-testid="protected-page"></div>} />
                    </Route>

                    <Route index element={<div data-testid="home-page"></div>} />
                </Routes>
            </MemoryRouter>
        </UserContext.Provider>
    );
}

describe("GuestGuard component", () => {
    it.each([
        { name: "on logged out renders the children components", loggedInUserId: false },
        { name: "on logged in user navigates to home page", loggedInUserId: "342ed" },
    ])("$name", ({ loggedInUserId }) => {
        setup({
            loggedInUserId,
        });

        if (loggedInUserId) {
            expect(screen.getByTestId("home-page")).toBeInTheDocument();
        } else {
            expect(screen.getByTestId("protected-page")).toBeInTheDocument();
        }
    });
});