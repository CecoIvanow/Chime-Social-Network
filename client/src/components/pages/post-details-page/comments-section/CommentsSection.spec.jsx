import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CommentsSection from "./CommentsSection";

vi.mock("./comment-items-list/CommentItemsList", () => ({
    default: () => <div data-testid="comment-items-list"></div>
}));

vi.mock("./comments-section-header/CommentsSectionHeader", () => ({
    default: () => <div data-testid="comments-section-header"></div>
}));

beforeEach(() => {
    render(
        <CommentsSection />
    );
});

describe("CommentsSection component", () => {
    it("renders comment items list", () => {
        expect(screen.getByTestId("comment-items-list")).toBeInTheDocument();
    });

    it("renders comment header", () => {
        expect(screen.getByTestId("comments-section-header")).toBeInTheDocument();
    });
});