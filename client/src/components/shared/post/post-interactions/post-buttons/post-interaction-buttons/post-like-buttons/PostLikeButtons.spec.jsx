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

    options.onLikeEmptyReturn ? onLikeClickHandler.mockResolvedValue(false) : onLikeClickHandler.mockResolvedValue(true);
    options.onUnlikeEmptyReturn ? onUnlikeClickHandler.mockResolvedValue(false) : onUnlikeClickHandler.mockResolvedValue(true);

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
    it("unlike button is rendered when user has liked the post", () => {
        setup();

        expect(screen.getByRole("button")).toHaveTextContent('Unlike');
    });

    it("like button is rendered when user has not liked the post", () => {
        setup({
            isLikedByUser: false,
            onLikeEmptyReturn: true,
            onUnlikeEmptyReturn: true,
        });

        expect(screen.getByRole("button")).toHaveTextContent('Like');
    });

    it("calls setLikes to add user when onLikeClickHandler resolves successfully", async () => {
        const user = userEvent.setup();
        setup({
            isLikedByUser: false,
            onLikeEmptyReturn: false,
            onUnlikeEmptyReturn: false,
        });

        const likeButton = screen.getByText('Like');

        expect(onLikeClickHandler).toHaveBeenCalledTimes(0);

        await user.click(likeButton);

        await waitFor(() => {
            expect(onLikeClickHandler).toHaveBeenCalledWith(post);
            expect(setLikes).toHaveBeenCalled();
        })
    });

    it("calls setLikes to remove user when onUnlikeClickHandler resolves successfully", async () => {
        const user = userEvent.setup();
        setup({
            isLikedByUser: true,
            onLikeEmptyReturn: false,
            onUnlikeEmptyReturn: false,
        });

        const unlikeButton = screen.getByText('Unlike');

        expect(onUnlikeClickHandler).toHaveBeenCalledTimes(0);

        await user.click(unlikeButton);

        await waitFor(() => {
            expect(onUnlikeClickHandler).toHaveBeenCalledWith(post);
            expect(setLikes).toHaveBeenCalled();
        });
    });

    it("does not call setLikes to add user when onLikeClickHandler does not resolves", async () => {
        const user = userEvent.setup();
        setup({
            isLikedByUser: false,
            onLikeEmptyReturn: true,
            onUnlikeEmptyReturn: false,
        });

        const likeButton = screen.getByText('Like');

        expect(onLikeClickHandler).toHaveBeenCalledTimes(0);

        await user.click(likeButton);

        await waitFor(() => {
            expect(onLikeClickHandler).toHaveBeenCalledWith(post);
            expect(setLikes).not.toHaveBeenCalled();
        });
    });

    it("does not call setLikes to remove user when onUnlikeClickHandler does not resolves", async () => {
        const user = userEvent.setup();
        setup({
            isLikedByUser: true,
            onLikeEmptyReturn: true,
            onUnlikeEmptyReturn: true,
        });

        const unlikeButton = screen.getByText('Unlike');

        expect(onUnlikeClickHandler).toHaveBeenCalledTimes(0);

        await user.click(unlikeButton);

        await waitFor(() => {
            expect(onUnlikeClickHandler).toHaveBeenCalledWith(post);
            expect(setLikes).not.toHaveBeenCalled();
        });
    });

    it("updates likes array correctly when onLikeClickHandler resolves true", async () => {
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

        const likeButton = screen.getByText("Like");
        await user.click(likeButton);

        expect(onLikeClickHandler).toHaveBeenCalledWith(post);
        expect(setLikes).toHaveBeenCalled();
    });
    it("updates likes array correctly when onUnlikeClickHandler resolves true", async () => {
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

        const unlikeButton = screen.getByText("Unlike");
        await user.click(unlikeButton);

        expect(onUnlikeClickHandler).toHaveBeenCalledWith(post);
        expect(setLikes).toHaveBeenCalled();
    });
});