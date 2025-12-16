import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PostInteractionButtons from "./PostInteractionButtons";

import { UserContext } from "../../../../../../contexts/user-context";
import { PostContext } from "../../../../../../contexts/post-context";

import { useParams } from "react-router";

vi.mock("./post-like-buttons/PostLikeButtons", () => ({
    default: () => <button data-testid="like-btn"></button>
}))

vi.mock("./post-comment-button/PostCommentButton", () => ({
    default: () => <button data-testid="comment-btn"></button>
}))

vi.mock("react-router", () => ({
    useParams: vi.fn(),
}))

const post = {
    owner: {
        _id: "OtherUserId"
    }
}

describe("PostInteractionButtons component", () => {
    it("renders like button on valid isUser and different post owner id", () => {
        useParams.mockReturnValue({ postId: "someId" });
        const isUser = 'UserId'

        render(
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ post }}>
                    <PostInteractionButtons />
                </PostContext.Provider>
            </UserContext.Provider>
        );

        expect(screen.getByTestId('like-btn')).toBeInTheDocument();
    });

    it("does not render like button on valid isUser and matching post owner id", () => {
        useParams.mockReturnValue({ postId: "someId" });
        const isUser = 'OtherUserId'

        render(
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ post }}>
                    <PostInteractionButtons />
                </PostContext.Provider>
            </UserContext.Provider>
        );

        expect(screen.queryByTestId('like-btn')).not.toBeInTheDocument();
    });

    it("renders comment button on falsey postId", () => {
        useParams.mockReturnValue({ postId: ''});
        const isUser = 'UserId'

        render(
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ post }}>
                    <PostInteractionButtons />
                </PostContext.Provider>
            </UserContext.Provider>
        );

        expect(screen.getByTestId('comment-btn')).toBeInTheDocument();
    });

    it("does not render comment button on truthy postId", () => {
        useParams.mockReturnValue({ postId: 'someId' });
        const isUser = 'UserId'

        render(
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ post }}>
                    <PostInteractionButtons />
                </PostContext.Provider>
            </UserContext.Provider>
        );

        expect(screen.queryByTestId('comment-btn')).not.toBeInTheDocument();
    });
})