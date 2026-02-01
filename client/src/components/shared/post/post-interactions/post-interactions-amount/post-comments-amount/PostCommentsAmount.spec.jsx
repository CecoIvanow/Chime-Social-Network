import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PostContext } from "../../../../../../contexts/post-context";

import PostCommentsAmount from "./PostCommentsAmount";

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