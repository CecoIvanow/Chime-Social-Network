import { Link, MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import GuestAuthMenu from "./GuestAuthMenu";

vi.mock("../menu-link/MenuLink", () => ({
    default: ({ linkTitle, linkUrl, linkText }) => (
        <Link to={linkUrl} title={linkTitle}>
            {linkText}
        </Link>
    )
}));

beforeEach(() => {
    render(
        <MemoryRouter>
            <GuestAuthMenu />
        </MemoryRouter>
    );
});

describe("GuestAuthMenu component", () => {
    it("renders Register navigational link with correct href and title attributes", () => {
        const registerLinkEl = screen.getByRole("link", {name: "Register"});

        expect(registerLinkEl).toHaveAttribute("href", "/register");
        expect(registerLinkEl).toHaveAttribute("title", "Register");
    });

    it("renders Login navigational link with correct href and title attributes", () => {
        const loginLinkEl = screen.getByRole("link", { name: "Login" });

        expect(loginLinkEl).toHaveAttribute("href", "/login");
        expect(loginLinkEl).toHaveAttribute("title", "Login");
    });
});