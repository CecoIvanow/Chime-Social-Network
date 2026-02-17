import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import HeroSection from "./HeroSection";

const HERO_HEADING_TEXT = "Stay Connected with Your Social Circle";
const HERO_SUBHEADING_TEXT = "Share moments, connect with friends, and discover new communities in a safe and welcoming environment.";
const REGISTER_TEXT = "Join Free Today";
const LOGIN_TEXT = "Log into your account";
const CATALOG_TEXT = "Check public posts";

beforeEach(() => {
    render(
        <MemoryRouter>
            <HeroSection />
        </MemoryRouter>
    )
});

describe("HeroSection component", () => {
    it("renders hero section with title and description", () => {
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(HERO_HEADING_TEXT);
        expect(screen.getByRole("paragraph")).toHaveTextContent(HERO_SUBHEADING_TEXT);
    });

    it("renders link buttons with correct href attributes", () => {
        expect(screen.getByText(REGISTER_TEXT)).toHaveAttribute("href", "/register");
        expect(screen.getByText(LOGIN_TEXT)).toHaveAttribute("href", "/login");
        expect(screen.getByText(CATALOG_TEXT)).toHaveAttribute("href", "/catalog");
    });
});
