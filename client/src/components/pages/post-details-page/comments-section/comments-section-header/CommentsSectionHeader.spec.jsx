import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import CommentsSectionHeader from "./CommentsSectionHeader";

const PARAGRAPH_TEXT = "All Comments:";

beforeEach(() => {
    render(
        <CommentsSectionHeader />
    );
});

describe("CommentSectionHeader component", () => {
    it("renders with correct text value", () => {
        expect(screen.getByText(PARAGRAPH_TEXT)).toBeInTheDocument();
    });
});