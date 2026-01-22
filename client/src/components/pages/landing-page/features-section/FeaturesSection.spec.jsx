import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import FeaturesSection from "./FeaturesSection";

vi.mock("./feature-card/FeatureCard", () => ({
    default: ({ title, description }) => <>
        <h4 data-testid="feature-card-title">{title}</h4>
        <p data-testid="feature-card-content">
            {description}
        </p>
    </>
}));

const featureCards = [
    { iconClass: "fas fa-user-friends", headingId: "profile-heading", title: "Personal Profiles", description: "Create your profile, share your story, and showcase your personality." },
    { iconClass: "fas fa-comments", headingId: "chat-heading", title: "Real-time Chat", description: "Stay in touch with instant messaging with friends and family." },
    { iconClass: "fas fa-users", headingId: "groups-heading", title: "Friends", description: "Get in touch with your friends that share your passions and hobbies, from travel to music and beyond." },
];

beforeEach(() => render(<FeaturesSection />));

describe("FeaturesSection component", () => {
    it("renders components with props", () => {
        const featureCardsTitles = screen.getAllByTestId("feature-card-title");
        const featureCardsContent = screen.getAllByTestId("feature-card-content");

        for (let i = 0; i < featureCards.length; i++) {
            expect(featureCardsTitles[i]).toHaveTextContent(featureCards[i].title);
            expect(featureCardsContent[i]).toHaveTextContent(featureCards[i].description);
        }

        expect(screen.getByRole("heading", {level: 2})).toHaveTextContent("Key Features");
    });
});