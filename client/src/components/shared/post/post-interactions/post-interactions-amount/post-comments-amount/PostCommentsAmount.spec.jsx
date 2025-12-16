import { getByText, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PostCommentsAmount from "./PostCommentsAmount";
import { PostContext } from "../../../../../../contexts/post-context";

describe("PostCommentsAmount component", () => {
    const post = {
        comments: ["commentOne", "commentTwo"]
    }

    it("renders component with correct amount of comments", () => {
        render(
            <PostContext.Provider value={{ post }}>
                <PostCommentsAmount />
            </PostContext.Provider>
        );
        
        expect(screen.getByText(`Comments: ${post.comments.length}`)).toBeInTheDocument();
    });
});