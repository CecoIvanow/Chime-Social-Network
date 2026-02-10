import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import FeatureCard from "./FeatureCard";

const HEADING_ID = "123";
const FEATURE_CARD_TITLE = "Feature Card Title";
const FEATURE_CARD_DESCRIPTION = "Feature Card Description";

beforeEach(() => render(
    <FeatureCard
        headingId={HEADING_ID}
        title={FEATURE_CARD_TITLE}
        description={FEATURE_CARD_DESCRIPTION}
    />));

describe("FeatureCard component", () => {
    it("renders component with passed props", () => {

        expect(screen.getByRole("heading", {level: 3})).toHaveTextContent(FEATURE_CARD_TITLE);
        
        expect(screen.getByRole("paragraph")).toHaveTextContent(FEATURE_CARD_DESCRIPTION);
    });
});