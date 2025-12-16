import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PostInteractionsAmount from "./PostInteractionsAmount";

vi.mock("./post-likes-amount/PostLikesAmount", () => ({
    default: () => <div data-testid="likes-amount"></div>
}));

vi.mock("./post-comments-amount/PostCommentsAmount", () => ({
    default: () => <div data-testid="comments-amount"></div>
}));

describe("PostInteractionsAmount component", () => {
    it("renders PostLikesAmount and PostCommentsSmount", () => {
        render(
            <PostInteractionsAmount />
        )

        expect(screen.getByTestId("comments-amount")).toBeInTheDocument();
        expect(screen.getByTestId("likes-amount")).toBeInTheDocument();
    })
})