import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PostItem from "./PostItem";

vi.mock("../../post-header/PostHeader", () => ({
    default: () => <div data-testid="post-header"></div>
}));

vi.mock("../../post-interactions/PostInteractions", () => ({
    default: () => <div data-testid="post-interactions"></div>
}));

vi.mock("../../post-text/PostText", () => ({
    default: ({ postText }) => <div data-testid="post-text">{postText}</div>
}));

const postItemMock = {
    _id: "postId",
    text: "This is a post!"
};

function setup(options = {
    emptyPostItem: false,
}) {
    const postItem = options.emptyPostItem ? null : postItemMock;

        render(
            <PostItem postItem={postItem} />
        );
};

describe("PostItem component", () => {
    it("renders PostItem component on valid post id", () => {
        setup();

        expect(screen.getByTestId("post-header")).toBeInTheDocument();
        expect(screen.getByTestId("post-interactions")).toBeInTheDocument();
        expect(screen.getByTestId("post-text")).toBeInTheDocument();
        expect(screen.getByTestId("post-text")).toHaveTextContent(postItemMock.text);
    });

    it("does not render PostItem on falsy post id", () => {
        setup({
            emptyPostItem: true,
        });

        expect(screen.queryByTestId("post-header")).not.toBeInTheDocument();
        expect(screen.queryByTestId("post-interactions")).not.toBeInTheDocument();
        expect(screen.queryByTestId("post-text")).not.toBeInTheDocument();
    });
});