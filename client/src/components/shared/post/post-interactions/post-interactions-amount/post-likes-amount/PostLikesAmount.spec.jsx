import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PostLikesAmount from "./PostLikesAmount";
import { LikesContext } from "../../../../../../contexts/likes-context";

describe("PostLikesAmount component", () => {
    const likes = ["likeOne", "likeTwo"];

    it("renders component with correct amount of likes", () => {
        render(
            <LikesContext.Provider value={{ likes }}>
                <PostLikesAmount />
            </LikesContext.Provider>
        );

        expect(screen.getByText(`Likes: ${likes.length}`)).toBeInTheDocument();
    });
});