import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CommentsSectionHeader from "./CommentsSectionHeader";

const PARAGRAPH_TEXT = "All Comments:";

describe("CommentSectionHeader component", () => {
    it("renders component with hardcoded text content", () => {
        render(
            <CommentsSectionHeader />
        );

        expect(screen.getByText(PARAGRAPH_TEXT)).toBeInTheDocument();
    });
});