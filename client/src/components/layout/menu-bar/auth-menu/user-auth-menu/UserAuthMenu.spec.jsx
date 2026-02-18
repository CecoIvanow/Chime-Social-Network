import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { Link, MemoryRouter } from "react-router";

import UserAuthMenu from "./UserAuthMenu";

vi.mock("../menu-link/MenuLink", () => ({
    default: ({ linkImageAlt, linkImageUri, linkTitle, linkUrl }) => (
        <Link to={linkUrl} title={linkTitle}>
            <img src={linkImageUri} alt={linkImageAlt} />
        </Link>
    )
}));

beforeEach(() => {
    render(
        <MemoryRouter>
            <UserAuthMenu />
        </MemoryRouter>
    );
});

describe("UserAuthMenu component", () => {
    it("renders Logout navigational link with correct href and title attributes", () => {
        const logoutLinkEl = screen.getByRole("link", { name: "Logout" });

        expect(logoutLinkEl).toHaveAttribute("href", "/logout");
        expect(logoutLinkEl).toHaveAttribute("title", "Logout");
    });

    it("renders Logout image with correct src uri and alt attributes", () => {
        const logoutImgEl = screen.getByRole("img", { name: "Logout" });

        expect(logoutImgEl).toHaveAttribute("src", "\\images\\logout-icon.png");
    });

    it("renders Settings navigational link with correct href and title attributes", () => {
        const settingsLinkEl = screen.getByRole("link", { name: "Settings" });

        expect(settingsLinkEl).toHaveAttribute("href", "/settings");
        expect(settingsLinkEl).toHaveAttribute("title", "Settings");
    });

    it("renders Settings image with correct src uri and alt attributes", () => {
        const settingsImgEl = screen.getByRole("img", { name: "Settings" });

        expect(settingsImgEl).toHaveAttribute("src", "\\images\\settings-icon.png");
    });
});