import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useContext } from "react";

import { PostContext } from "../../../../contexts/post-context";
import { LikesContext } from "../../../../contexts/likes-context";

import PostInteractions from "./PostInteractions";

vi.mock("./post-interactions-amount/PostInteractionsAmount", () => ({
    default: () => <div data-testid='post-interactions-amount'></div>
}));

vi.mock("./post-buttons/PostButtons", () => ({
    default: () => <button data-testid="post-button"></button>
}));

describe("PostInteractions component", () => {
    const post = {
        likes: ["like1", "like2"],
    };

    it("renders PostInteractionsAmount and PostButtons", () => {
        render(
            <PostContext.Provider value={{ post }}>
                <PostInteractions />
            </PostContext.Provider>
        );

        expect(screen.getByTestId("post-interactions-amount")).toBeInTheDocument();
        expect(screen.getByTestId("post-button")).toBeInTheDocument();
    });

    it("provides likes array through LikesContext", () => {
        function LikesConsumer() {
            const { likes } = useContext(LikesContext);

            return <div data-testid="likes-count">{likes.length}</div>
        }

        render(
            <PostContext.Provider value={{ post }}>
                <LikesContext.Provider value={{ likes: post.likes, setLikes: () => { } }}>
                    <LikesConsumer />
                </LikesContext.Provider>
            </PostContext.Provider>
        );

        expect(screen.getByTestId("likes-count")).toHaveTextContent("2");
    });

    it("renders without error when post.likes is undefined", () => {
        const post = {};

        render(
            <PostContext.Provider value={{ post }}>
                <PostInteractions />
            </PostContext.Provider>
        );

        expect(screen.getByTestId("post-interactions-amount")).toBeInTheDocument();
        expect(screen.getByTestId("post-button")).toBeInTheDocument();
    });
});