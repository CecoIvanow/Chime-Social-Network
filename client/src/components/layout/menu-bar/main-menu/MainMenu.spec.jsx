import { Link, MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../../../contexts/user-context";

import MainMenu from "./MainMenu";

vi.mock("../menu-link/MenuLink", () => ({
    default: ({ linkImageAlt, linkImageUri, linkTitle, linkUrl }) => (
        <Link to={linkUrl} title={linkTitle}>
            <img src={linkImageUri} alt={linkImageAlt} />
        </Link>
    )
}));

const isUserMock = "userId";

function setup(options = {
    isUserValid: false
}) {
    const isUser = options.isUserValid ? isUserMock : null;

    render(
        <MemoryRouter>
            <UserContext.Provider value={{ isUser }}>
                <MainMenu />
            </UserContext.Provider>
        </MemoryRouter>
    );
};

describe("MainMenu component", () => {
    it("renders Catalog navigational image link with correct title and href and with src and alt image attributes", () => {
        setup();

        expect(screen.getByRole("link", { name: "Catalog" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Catalog" })).toHaveAttribute("href", "/catalog");

        expect(screen.getByRole("img", { name: "Catalog" })).toBeInTheDocument();
        expect(screen.getByRole("img", { name: "Catalog" })).toHaveAttribute("src", "\\images\\catalog-icon.png");
    });

    it("renders Home navigational image link with correct title and href and with src and alt image attributes", () => {
        setup();

        expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
        
        expect(screen.getByRole("img", { name: "Home" })).toBeInTheDocument();
        expect(screen.getByRole("img", { name: "Home" })).toHaveAttribute("src", "\\images\\home-icon.png");
    });

    it.each([
        { name: "renders Profile navigational image link with correct title and href and with src and alt image attributes on logged in user", isUserValid: true },
        { name: "does not render Profile navigational image link on logged out user", isUserValid: false },
    ])("$name", ({ isUserValid }) => {
        setup({
            isUserValid
        });

        
        if (isUserValid) {
            expect(screen.getByRole("link", { name: "Profile" })).toBeInTheDocument();
            expect(screen.getByRole("img", { name: "Profile" })).toBeInTheDocument();

            expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", `/profile/${isUserMock}`);
            expect(screen.getByRole("img", { name: "Profile" })).toHaveAttribute("src", "\\images\\profile-icon.png");
        } else {
            expect(screen.queryByRole("link", {name: "Profile"})).not.toBeInTheDocument();
            expect(screen.queryByRole("img", {name: "Profile"})).not.toBeInTheDocument();
        }
    });
});