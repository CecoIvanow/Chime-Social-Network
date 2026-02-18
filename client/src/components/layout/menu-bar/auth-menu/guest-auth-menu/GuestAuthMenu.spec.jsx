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
    it("renders Login and Register navigational links", () => {
        const loginLinkEl = screen.getByRole("link", {name: "Login"});
        const registerLinkEl = screen.getByRole("link", {name: "Register"});
    
        expect(loginLinkEl).toHaveAttribute("href", "/login");
        expect(loginLinkEl).toHaveAttribute("title", "Login");
        expect(loginLinkEl).toHaveTextContent("Login");

        expect(registerLinkEl).toHaveAttribute("href", "/register");
        expect(registerLinkEl).toHaveAttribute("title", "Register");
        expect(registerLinkEl).toHaveTextContent("Register");
    });
});