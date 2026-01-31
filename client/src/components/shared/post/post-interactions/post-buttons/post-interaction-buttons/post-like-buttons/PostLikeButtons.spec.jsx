import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../../../../contexts/actions-context";
import { LikesContext } from "../../../../../../../contexts/likes-context";
import { PostContext } from "../../../../../../../contexts/post-context";
import { UserContext } from "../../../../../../../contexts/user-context";

import PostLikeButtons from "./PostLikeButtons";

vi.mock("../../../../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName, onClickHandler }) => (
        <div data-testid="button" onClick={onClickHandler}>{buttonName}</div>
    )
}));

const post = {
    _id: 1
}

const isUser = "User1";

const setLikes = vi.fn()
const onLikeClickHandler = vi.fn();
const onUnlikeClickHandler = vi.fn();

describe("PostLikeButtons component", () => {
    it("post renders unlike button when already liked", () => {
        const likes = [isUser, "User2"]

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

        expect(screen.getByTestId('button')).toHaveTextContent('Unlike');
    });

    it("post renders like button when not liked", () => {
        const likes = ["User2"];

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

        expect(screen.getByTestId('button')).toHaveTextContent('Like');
    });

    it("calls setLikes to add user when onLikeClickHandler resolves successfully", async () => {
        const likes = ["User2"];

        const onLikeClickHandler = vi.fn().mockResolvedValue(true);

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

        const likeButton = screen.getByText('Like');

        expect(onLikeClickHandler).toHaveBeenCalledTimes(0);

        fireEvent.click(likeButton);

        await waitFor(() => {
            expect(onLikeClickHandler).toHaveBeenCalledWith(post);
            expect(setLikes).toHaveBeenCalled();
        })
    });

    it("calls setLikes to remove user when onUnlikeClickHandler resolves successfully", async () => {
        const likes = [isUser, "User2"];

        const onUnlikeClickHandler = vi.fn().mockResolvedValue(true);

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

        const unlikeButton = screen.getByText('Unlike');

        expect(onUnlikeClickHandler).toHaveBeenCalledTimes(0);

        fireEvent.click(unlikeButton);

        await waitFor(() => {
            expect(onUnlikeClickHandler).toHaveBeenCalledWith(post);
            expect(setLikes).toHaveBeenCalled();
        });
    });

    it("does not call setLikes to add user when onLikeClickHandler does not resolves", async () => {
        const likes = ["User2"];

        const onLikeClickHandler = vi.fn().mockResolvedValue(false);

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

        const likeButton = screen.getByText('Like');

        expect(onLikeClickHandler).toHaveBeenCalledTimes(0);

        fireEvent.click(likeButton);

        await waitFor(() => {
            expect(onLikeClickHandler).toHaveBeenCalledWith(post);
            expect(setLikes).not.toHaveBeenCalled();
        });
    });

    it("does not call setLikes to remove user when onUnlikeClickHandler does not resolves", async () => {
        const likes = [isUser, "User2"];

        const onUnlikeClickHandler = vi.fn().mockResolvedValue(false);

        render(
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ post }}>
                    <ActionsContext.Provider value={{ onLikeClickHandler: onUnlikeClickHandler, onUnlikeClickHandler }}>
                        <LikesContext.Provider value={{ likes, setLikes }}>
                            <PostLikeButtons />
                        </LikesContext.Provider>
                    </ActionsContext.Provider>
                </PostContext.Provider>
            </UserContext.Provider>
        );

        const unlikeButton = screen.getByText('Unlike');

        expect(onUnlikeClickHandler).toHaveBeenCalledTimes(0);

        fireEvent.click(unlikeButton);

        await waitFor(() => {
            expect(onUnlikeClickHandler).toHaveBeenCalledWith(post);
            expect(setLikes).not.toHaveBeenCalled();
        });
    });

    it("updates likes array correctly when onLikeClickHandler resolves true", async () => {
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
        await fireEvent.click(likeButton);

        expect(onLikeClickHandler).toHaveBeenCalledWith(post);
        expect(setLikes).toHaveBeenCalled();
    });
    it("updates likes array correctly when onUnlikeClickHandler resolves true", async () => {
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
        await fireEvent.click(unlikeButton);

        expect(onUnlikeClickHandler).toHaveBeenCalledWith(post);
        expect(setLikes).toHaveBeenCalled();
    });
});