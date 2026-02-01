import { useParams } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../../../../../contexts/user-context";
import { PostContext } from "../../../../../../contexts/post-context";

import PostInteractionButtons from "./PostInteractionButtons";

vi.mock("./post-like-buttons/PostLikeButtons", () => ({
    default: () => <button>{"Like"}</button>
}));

vi.mock("./post-comment-button/PostCommentButton", () => ({
    default: () => <button>{"Comment"}</button>
}));

vi.mock("react-router", () => ({
    useParams: vi.fn(),
}));

const post = {
    owner: {
        _id: "userId"
    }
};

function setup(options = {
    useParamsEmptyPostId: false,
    userIdEqualsPostOwnerId: true,
}) {
    const postId = options.useParamsEmptyPostId ? null : "123";

    const isUser = options.userIdEqualsPostOwnerId ? post.owner._id : "differentUserId";

    useParams.mockReturnValue({ postId });

    render(
        <UserContext.Provider value={{ isUser }}>
            <PostContext.Provider value={{ post }}>
                <PostInteractionButtons />
            </PostContext.Provider>
        </UserContext.Provider>
    );
};

describe("PostInteractionButtons component", () => {
    it("renders like button on valid isUser and different post owner id", () => {
        setup({
            useParamsEmptyPostId: false,
            userIdEqualsPostOwnerId: false,
        });

        expect(screen.getByRole("button", { name: "Like" })).toBeInTheDocument();
    });

    it("does not render like button on valid isUser and matching post owner id", () => {
        setup({
            useParamsEmptyPostId: false,
            userIdEqualsPostOwnerId: true,
        });

        expect(screen.queryByRole("button", { name: "Like" })).not.toBeInTheDocument();
    });

    it("renders comment button on falsey postId", () => {
        setup({
            useParamsEmptyPostId: true,
            userIdEqualsPostOwnerId: false,
        });

        expect(screen.getByRole("button", { name: "Comment" })).toBeInTheDocument();
    });

    it("does not render comment button on truthy postId", () => {
        setup();

        expect(screen.queryByRole("button", { name: "Comment" })).not.toBeInTheDocument();

    });
})