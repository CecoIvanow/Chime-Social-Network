import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import LandingPage from "./LandingPage";

vi.mock("./hero-section/HeroSection", () => ({
    default: () => <div data-testid="hero-section"></div>
}));

vi.mock("./features-section/FeaturesSection", () => ({
    default: () => <div data-testid="features-section"></div>
}));

beforeEach(() => {
    render(
        <LandingPage />
    );
});

describe("LandingPage component", () => {
    it("renders landing page with hero and features sections", () => {
        expect(screen.getByTestId("hero-section")).toBeInTheDocument();
        expect(screen.getByTestId("features-section")).toBeInTheDocument();
    });
});