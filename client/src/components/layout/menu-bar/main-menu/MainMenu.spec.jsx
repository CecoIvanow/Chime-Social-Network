import { Link, MemoryRouter } from "react-router";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

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
    const isUser = options.isUserValid ? isUserMock : "";

    render(
        <MemoryRouter>
            <UserContext.Provider value={{ isUser }}>
                <MainMenu />
            </UserContext.Provider>
        </MemoryRouter>
    );
};

describe("MainMenu component", () => {
    it("renders Home and Catalog MenuLink navigational components with passed props", () => {
        setup();

        const HomeLinkEl = screen.getByRole("link", { name: "Home" });
        const HomeImgEl = screen.getByRole("img", { name: "Home" });

        expect(HomeLinkEl).toHaveAttribute("href", "/");
        expect(HomeLinkEl).toHaveAttribute("title", "Home");

        expect(HomeImgEl).toHaveAttribute("src", "\\images\\home-icon.png");
        expect(HomeImgEl).toHaveAttribute("alt", "Home");

        const catalogLinkEl = screen.getByRole("link", { name: "Catalog" });
        const catalogImgEl = screen.getByRole("img", { name: "Catalog" });

        expect(catalogLinkEl).toHaveAttribute("href", "/catalog");
        expect(catalogLinkEl).toHaveAttribute("title", "Catalog");

        expect(catalogImgEl).toHaveAttribute("src", "\\images\\catalog-icon.png");
        expect(catalogImgEl).toHaveAttribute("alt", "Catalog");
    });

    it.each([
        { name: "renders Profile navigational component on valid isUser", isUserValid: true },
        { name: "does not render Profile navigational component on empty isUser", isUserValid: false }
    ])("$name", ({ isUserValid }) => {
        setup({
            isUserValid
        });

        
        if (isUserValid) {
            const profileLinkEl = screen.getByRole("link", { name: "Profile" });
            const profileImgEl = screen.getByRole("img", { name: "Profile" });

            expect(profileLinkEl).toHaveAttribute("href", `/profile/${isUserMock}`);
            expect(profileLinkEl).toHaveAttribute("title", "Profile");

            expect(profileImgEl).toHaveAttribute("src", "\\images\\profile-icon.png");
            expect(profileImgEl).toHaveAttribute("alt", "Profile");
        } else {
            expect(screen.queryByRole("link", {name: "Profile"})).not.toBeInTheDocument();
            expect(screen.queryByRole("img", {name: "Profile"})).not.toBeInTheDocument();
        }
    });
});