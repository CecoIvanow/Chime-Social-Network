import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LikesContext } from "../../../../../../contexts/likes-context";

import PostLikesAmount from "./PostLikesAmount";

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