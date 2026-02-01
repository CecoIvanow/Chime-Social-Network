import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import { PostContext } from "../../../../../../contexts/post-context";

import PostCommentsAmount from "./PostCommentsAmount";

const post = {
    comments: ["commentOne", "commentTwo"]
};

beforeEach(() => {
    render(
        <PostContext.Provider value={{ post }}>
            <PostCommentsAmount />
        </PostContext.Provider>
    );
});

describe("PostCommentsAmount component", () => {
    it("renders with correct amount of comments in text content", () => {
        expect(screen.getByText(`Comments: ${post.comments.length}`)).toBeInTheDocument();
    });
});