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
    isUserIsEmpty: false
}) {
    const isUser = options.isUserIsEmpty ? "" : isUserMock;

    render(
        <MemoryRouter>
            <UserContext.Provider value={{ isUser }}>
                <MainMenu />
            </UserContext.Provider>
        </MemoryRouter>
    );
};

describe("MainMenu component", () => {
    it("renders Home and Catalog MenuLink child components with passed props", () => {
        setup();

        const HomeLinkEl = screen.getByRole("link", { name: "Home" });
        const HomeImgEl = screen.getByRole("img", { name: "Home"});

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
});