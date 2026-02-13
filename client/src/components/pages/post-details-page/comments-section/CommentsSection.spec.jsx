import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CommentsSection from "./CommentsSection";

const COMMENT_CONTENT = "First comment!";

const SECTION_HEADER_CONTENT = "Comments:";

vi.mock("./comment-items-list/CommentItemsList", () => ({
    default: () => <div data-testid="comment">{COMMENT_CONTENT}</div>
}))

vi.mock("./comments-section-header/CommentsSectionHeader", () => ({
    default: () => <div data-testid="comments-section-header">{SECTION_HEADER_CONTENT}</div>
}))

beforeEach(() => {
    render(
        <CommentsSection />
    );
});

describe("CommentsSection component", () => {
    it("renders CommentItemsList", () => {
        expect(screen.getByTestId("comment")).toHaveTextContent(COMMENT_CONTENT);
    });

    it("renders CommentsSectionHeader", () => {
        expect(screen.getByTestId("comments-section-header")).toHaveTextContent(SECTION_HEADER_CONTENT);
    });
});