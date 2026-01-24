import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    it("renders Catalog and Logouts navigational links", () => {
        const settingsLinkEl = screen.getByRole("link", { name: "Settings" });
        const settingsImgEl = screen.getByRole("img", { name: "Settings" });

        expect(settingsLinkEl).toHaveAttribute("href", "/settings");
        expect(settingsLinkEl).toHaveAttribute("title", "Settings");

        expect(settingsImgEl).toHaveAttribute("src", "\\images\\settings-icon.png");
        expect(settingsImgEl).toHaveAttribute("alt", "Settings");

        const logoutLinkEl = screen.getByRole("link", { name: "Logout" });
        const logoutImgEl = screen.getByRole("img", { name: "Logout" });

        expect(logoutLinkEl).toHaveAttribute("href", "/logout");
        expect(logoutLinkEl).toHaveAttribute("title", "Logout");

        expect(logoutImgEl).toHaveAttribute("src", "\\images\\logout-icon.png");
        expect(logoutImgEl).toHaveAttribute("alt", "Logout");
    });
});