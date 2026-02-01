import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useContext } from "react";

import { PostContext } from "../../../../contexts/post-context";
import { LikesContext } from "../../../../contexts/likes-context";

import PostInteractions from "./PostInteractions";

vi.mock("./post-interactions-amount/PostInteractionsAmount", () => ({
    default: () => (
        <div data-testid='post-interactions-amount'>
            <LikesConsumer />
        </div>
    )
}));

vi.mock("./post-buttons/PostButtons", () => ({
    default: () => <button data-testid="post-button"></button>
}));

const postMock = {
    likes: ["like1", "like2"],
};

function LikesConsumer() {
    const { likes } = useContext(LikesContext);

    return <div data-testid="likes-count">{likes.length}</div>
};

function setup(options = {
    renderPostWithoutLikes: false
}) {
    const post = options.renderPostWithoutLikes ? { likes: [] } : postMock;

    render(
        <PostContext.Provider value={{ post }}>
            <LikesContext.Provider value={{ likes: post.likes, setLikes: () => { } }}>
                <PostInteractions />
            </LikesContext.Provider>
        </PostContext.Provider>
    );
}


describe("PostInteractions component", () => {
    it("renders PostInteractionsAmount and PostButtons", () => {
        setup();

        expect(screen.getByTestId("post-interactions-amount")).toBeInTheDocument();
        expect(screen.getByTestId("post-button")).toBeInTheDocument();
    });

    it("provides likes array through LikesContext", () => {
        setup();

        expect(screen.getByTestId("likes-count")).toHaveTextContent("2");
    });

    it("renders without error when post.likes is undefined", () => {
        setup({
            renderPostWithoutLikes: true,
        })

        expect(screen.getByTestId("post-interactions-amount")).toBeInTheDocument();
        expect(screen.getByTestId("post-button")).toBeInTheDocument();
    });
});