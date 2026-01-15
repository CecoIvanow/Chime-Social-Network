import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import HeroSection from "./HeroSection";
import { MemoryRouter } from "react-router";

const HERO_HEADING_TEXT = "Stay Connected with Your Social Circle";
const HERO_SUBHEADING_TEXT = "Share moments, connect with friends, and discover new communities in a safe and welcoming environment.";
const REGISTER_TEXT = "Join Free Today";
const LOGIN_TEXT = "Log into your account";
const CATALOG_TEXT = "Check public posts";

beforeEach(() => render(
    <MemoryRouter>
        <HeroSection />
    </MemoryRouter>
));

describe("HeroSection component", () => {
    it("renders buttons with correct attributes", () => {
        expect(screen.getByText(REGISTER_TEXT)).toHaveAttribute("href", "/register");
        expect(screen.getByText(LOGIN_TEXT)).toHaveAttribute("href", "/login");
        expect(screen.getByText(CATALOG_TEXT)).toHaveAttribute("href", "/catalog");
    });
});
