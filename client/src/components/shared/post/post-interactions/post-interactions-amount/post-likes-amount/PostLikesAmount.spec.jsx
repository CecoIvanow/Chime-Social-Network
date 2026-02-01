import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import { LikesContext } from "../../../../../../contexts/likes-context";

import PostLikesAmount from "./PostLikesAmount";

const likes = ["likeOne", "likeTwo"];

beforeEach(() => {
    render(
        <LikesContext.Provider value={{ likes }}>
            <PostLikesAmount />
        </LikesContext.Provider>
    );
});

describe("PostLikesAmount component", () => {
    it("renders with correct amount of likes in its text content", () => {
        expect(screen.getByText(`Likes: ${likes.length}`)).toBeInTheDocument();
    });
});