import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PostItem from "./PostItem";

import { PostContext } from "../../../../../contexts/post-context";

vi.mock("../../post-header/PostHeader", () => ({
    default: () => <div data-testid="post-header"></div>
}));

vi.mock("../../post-interactions/PostInteractions", () => ({
    default: () => <div data-testid="post-interactions"></div>
}));

vi.mock("../../post-text/PostText", () => ({
    default: ({ postText }) => <div data-testid="post-text">{ postText }</div>
}));

describe("PostItem component", () => {
    const postItem = {
        _id: 'postId',
        text: 'This is a post!'
    }

    it("renders PostItem component on valid post id", () => {
        render(
            <PostItem postItem={ postItem } />
        );
        
        expect(screen.getByTestId("post-header")).toBeInTheDocument();
        expect(screen.getByTestId("post-interactions")).toBeInTheDocument();
        expect(screen.getByTestId("post-text")).toBeInTheDocument();
        expect(screen.getByTestId("post-text")).toHaveTextContent(postItem.text);
    });

    it("does not render PostItem on falsy post id", () => {
        postItem._id='';

        render(
            <PostItem postItem={postItem} />
        );

        expect(screen.queryByTestId("post-header")).not.toBeInTheDocument();
        expect(screen.queryByTestId("post-interactions")).not.toBeInTheDocument();
        expect(screen.queryByTestId("post-text")).not.toBeInTheDocument();
    });
});