import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../../../../contexts/actions-context";
import { LikesContext } from "../../../../../../../contexts/likes-context";
import { PostContext } from "../../../../../../../contexts/post-context";
import { UserContext } from "../../../../../../../contexts/user-context";

import PostLikeButtons from "./PostLikeButtons";

vi.mock("../../../../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName, onClickHandler }) => (
        <button onClick={onClickHandler}>{buttonName}</button>
    )
}));

const post = {
    _id: 1
};

const isUser = "User1";

const setLikes = vi.fn();
const onLikeClickHandler = vi.fn();
const onUnlikeClickHandler = vi.fn();

function setup(options = {
    isLikedByUser: true,
    onLikeEmptyReturn: false,
    onUnlikeEmptyReturn: false,
}) {
    const likes = options.isLikedByUser ? [isUser, "User2"] : ["User2"];

    options.onLikeEmptyReturn ? onLikeClickHandler.mockResolvedValue(null) : onLikeClickHandler.mockResolvedValue(true);
    options.onUnlikeEmptyReturn ? onUnlikeClickHandler.mockResolvedValue(null) : onUnlikeClickHandler.mockResolvedValue(true);

    render(
        <UserContext.Provider value={{ isUser }}>
            <PostContext.Provider value={{ post }}>
                <ActionsContext.Provider value={{ onLikeClickHandler, onUnlikeClickHandler }}>
                    <LikesContext.Provider value={{ likes, setLikes }}>
                        <PostLikeButtons />
                    </LikesContext.Provider>
                </ActionsContext.Provider>
            </PostContext.Provider>
        </UserContext.Provider>
    );
};

describe("PostLikeButtons component", () => {
    it("Unlike button is rendered when user has liked the post", () => {
        setup();

        expect(screen.getByRole("button", { name: "Unlike" })).toBeInTheDocument();
    });

    it("Like button is rendered when user has not liked the post", () => {
        setup({
            isLikedByUser: false,
            onLikeEmptyReturn: true,
            onUnlikeEmptyReturn: true,
        });

        expect(screen.getByRole("button", { name: "Like" })).toBeInTheDocument();
    });

    it("likes the post on Like button click", async () => {
        const user = userEvent.setup();
        setup({
            isLikedByUser: false,
            onLikeEmptyReturn: false,
            onUnlikeEmptyReturn: false,
        });

        await user.click(screen.getByRole("button", { name: "Like" }));

        await waitFor(() => {
            expect(onLikeClickHandler).toHaveBeenCalledWith(post);
        });
        expect(setLikes).toHaveBeenCalled();
    });

    it("removes like form the post on Unlike button click", async () => {
        const user = userEvent.setup();
        setup({
            isLikedByUser: true,
            onLikeEmptyReturn: false,
            onUnlikeEmptyReturn: false,
        });

        await user.click((screen.getByRole("button", { name: "Unlike" })));

        await waitFor(() => {
            expect(onUnlikeClickHandler).toHaveBeenCalledWith(post);
        });
        expect(setLikes).toHaveBeenCalled();
    });

    it("does nothing when the post like call fails", async () => {
        const user = userEvent.setup();
        setup({
            isLikedByUser: false,
            onLikeEmptyReturn: true,
            onUnlikeEmptyReturn: false,
        });

        await user.click(screen.getByRole("button", { name: "Like" }));

        await waitFor(() => {
            expect(onLikeClickHandler).toHaveBeenCalledWith(post);
        });
        expect(setLikes).not.toHaveBeenCalled();
    });

    it("does nothing when the post unlike call fails", async () => {
        const user = userEvent.setup();
        setup({
            isLikedByUser: true,
            onLikeEmptyReturn: true,
            onUnlikeEmptyReturn: true,
        });

        await user.click((screen.getByRole("button", { name: "Unlike" })));

        await waitFor(() => {
            expect(onUnlikeClickHandler).toHaveBeenCalledWith(post);
        });
        expect(setLikes).not.toHaveBeenCalled();
    });

    it("updates the amount of post likes on successful like", async () => {
        const user = userEvent.setup();
        const likes = ["User2"];

        const onLikeClickHandler = vi.fn().mockResolvedValue(true);

        const setLikes = vi.fn((updater) => {
            const updatedLikes = updater(likes);
            expect(updatedLikes).toEqual([...likes, isUser])
        })

        render(
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ post }}>
                    <ActionsContext.Provider value={{ onLikeClickHandler, onUnlikeClickHandler }}>
                        <LikesContext.Provider value={{ likes, setLikes }}>
                            <PostLikeButtons />
                        </LikesContext.Provider>
                    </ActionsContext.Provider>
                </PostContext.Provider>
            </UserContext.Provider>
        );

        await user.click((screen.getByRole("button", { name: "Like" })));

        expect(setLikes).toHaveBeenCalled();
    });
    it("updates the amount of post likes on successful unlike", async () => {
        const user = userEvent.setup();
        const likes = [isUser, "User2"];

        const onUnlikeClickHandler = vi.fn().mockResolvedValue(true);

        const setLikes = vi.fn((updater) => {
            const updatedLikes = updater(likes);
            expect(updatedLikes).toEqual(likes.filter(userLike => userLike !== isUser));
        })

        render(
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ post }}>
                    <ActionsContext.Provider value={{ onLikeClickHandler, onUnlikeClickHandler }}>
                        <LikesContext.Provider value={{ likes, setLikes }}>
                            <PostLikeButtons />
                        </LikesContext.Provider>
                    </ActionsContext.Provider>
                </PostContext.Provider>
            </UserContext.Provider>
        );

        await user.click((screen.getByRole("button", { name: "Unlike" })));

        expect(setLikes).toHaveBeenCalled();
    });
});