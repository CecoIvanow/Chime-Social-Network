import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import SectionHeading from "./SectionHeading";

const mockProps = {
    sectionName: "Friends",
};

beforeEach(() => {
    render(
        <SectionHeading {...mockProps} />
    );
});

describe("SectionHeading component", () => {
    it("renders heading with correct text value", () => {
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(mockProps.sectionName);
    });
});