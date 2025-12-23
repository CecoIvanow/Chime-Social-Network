import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CommentsSection from "./CommentsSection";

const COMMENT_CONTENT = "First comment!";

vi.mock("./comment-items-list/CommentItemsList", () => ({
    default: () => <div data-testid="comment">{COMMENT_CONTENT}</div>
}))

vi.mock("./comments-section-header/CommentsSectionHeader", () => ({
    default: () => <div data-testid="comments-section-header">Comments: </div>
}))

function setup() {
    render(
        <CommentsSection />
    );
};

describe("CommentsSection component", () => {
    beforeEach(() => {
        setup();
    })

    it("renders CommentItemsList", () => {
        expect(screen.getByTestId("comment")).toHaveTextContent("First comment!");
    });
});