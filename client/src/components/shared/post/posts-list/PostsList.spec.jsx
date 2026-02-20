import { useContext } from "react";

import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../contexts/actions-context";
import { AlertContext } from "../../../../contexts/alert-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";
import { UserContext } from "../../../../contexts/user-context";

import PostsList from "./PostsList";

vi.mock("../../../../hooks/usePostServices", () => ({
    default: () => ({
        ...usePostServicesMock
    })
}));

vi.mock("./post-item/PostItem", () => ({
    default: function PostItem({ postItem }) {
        const actions = useContext(ActionsContext);

        return (
            <div data-testid="post-item">
                <button onClick={() => actions.onDeleteClickHandler(postItem)}>Delete</button>
                <button onClick={() => actions.onLikeClickHandler(postItem)}>Like</button>
                <button onClick={() => actions.onUnlikeClickHandler(postItem)}>Unlike</button>
            </div>
        )
    }
}));

const FIRST_POST = 0;
const SECOND_POST = 1;

const ERR_MSG = {
    DELETE_POST: "Rejected deletePost call!",
    LIKE_POST: "Rejected likePost call!",
    UNLIKE_POST: "Rejected unlikePost call!",
};

const isUser = "userId";

const setAlert = vi.fn();

const totalPostsCtxMock = {
    totalPosts: [
        { _id: "1" },
        { _id: "2" },
    ],
    setTotalPosts: vi.fn(),
};

const usePostServicesMock = {
    deletePost: vi.fn(),
    likePost: vi.fn(),
    unlikePost: vi.fn(),
    abortAll: vi.fn(),
};

function setup(options = {
    deleteConfirmation: true,
    deletePostSuccessfullResolve: true,
    likePostSuccessfullResolve: true,
    unlikePostSuccessfullResolve: true,
}) {
    options.deletePostSuccessfullResolve ?
        usePostServicesMock.deletePost.mockResolvedValue(totalPostsCtxMock.totalPosts.at(0)._id) :
        usePostServicesMock.deletePost.mockRejectedValue(new Error(ERR_MSG.DELETE_POST));

    options.likePostSuccessfullResolve ? usePostServicesMock.likePost.mockResolvedValue(true) : usePostServicesMock.likePost.mockRejectedValue(new Error(ERR_MSG.LIKE_POST));
    options.unlikePostSuccessfullResolve ? usePostServicesMock.unlikePost.mockResolvedValue(true) : usePostServicesMock.unlikePost.mockRejectedValue(new Error(ERR_MSG.UNLIKE_POST));

    vi.spyOn(window, "confirm").mockReturnValue(options.deleteConfirmation);

    const { unmount } = render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <TotalPostsContext.Provider value={{ ...totalPostsCtxMock }}>
                    <PostsList />
                </TotalPostsContext.Provider>
            </UserContext.Provider>
        </AlertContext.Provider>
    );

    return { unmount };
};

describe("PostsList component", () => {
    it("renders correct amount of posts", () => {
        setup();

        expect(screen.getAllByTestId("post-item")).toHaveLength(2);
    });

    it.each([
        { name: "deletes post after delete popup confirmation", shouldTrigger: true, deleteConfirmation: true },
        { name: "does not delete post after delete popup rejection", shouldTrigger: false, deleteConfirmation: false },
    ])("$name", async ({ shouldTrigger, deleteConfirmation }) => {
        const user = userEvent.setup();
        setup({
            deleteConfirmation,
            deletePostSuccessfullResolve: true,
            likePostSuccessfullResolve: true,
            unlikePostSuccessfullResolve: true
        });

        await user.click(screen.getAllByText('Delete').at(FIRST_POST));

        if (shouldTrigger) {
            const updater = totalPostsCtxMock.setTotalPosts.mock.calls[0][0];
            const updatedPosts = updater(totalPostsCtxMock.totalPosts);

            expect(updatedPosts).toEqual([totalPostsCtxMock.totalPosts.at(SECOND_POST)]);
        } else {
            expect(totalPostsCtxMock.setTotalPosts).not.toHaveBeenCalled();
        };
    });

    it("shows alert message when post deletion is rejected", async () => {
        const user = userEvent.setup();
        setup({
            deleteConfirmation: true,
            deletePostSuccessfullResolve: false,
            likePostSuccessfullResolve: true,
            unlikePostSuccessfullResolve: true,
        });

        await user.click(screen.getAllByText('Delete').at(FIRST_POST));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.DELETE_POST);
        });
    });

    it("likes post whe nuser clicks on Like button", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getAllByText('Like').at(FIRST_POST));

        await vi.waitFor(() => {
            expect(usePostServicesMock.likePost).toHaveBeenCalledWith(isUser, totalPostsCtxMock.totalPosts.at(FIRST_POST)._id);
        });
    });

    it("shows alert message when post like gets rejected", async () => {
        const user = userEvent.setup();
        setup({
            deleteConfirmation: true,
            deletePostSuccessfullResolve: true,
            likePostSuccessfullResolve: false,
            unlikePostSuccessfullResolve: true
        });

        await user.click(screen.getAllByText('Like').at(FIRST_POST));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.LIKE_POST);
        });
    });

    it("removes post like when user clicks on Unlike button", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getAllByText('Unlike').at(FIRST_POST));

        await vi.waitFor(() => {
            expect(usePostServicesMock.unlikePost).toHaveBeenCalledWith(isUser, totalPostsCtxMock.totalPosts.at(FIRST_POST)._id);
        });
    });

    it("shows alert message when post unlike gets rejected", async () => {
        const user = userEvent.setup();
        setup({
            deleteConfirmation: true,
            deletePostSuccessfullResolve: true,
            likePostSuccessfullResolve: true,
            unlikePostSuccessfullResolve: false
        });

        await user.click(screen.getAllByText('Unlike').at(FIRST_POST));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.UNLIKE_POST);
        });
    });

    it("stops all ongoing calls on unmount", async () => {
        const user = userEvent.setup();
        const { unmount } = setup();

        await user.click(screen.getAllByText('Delete').at(FIRST_POST));
        await user.click(screen.getAllByText('Like').at(FIRST_POST));
        await user.click(screen.getAllByText('Unlike').at(FIRST_POST));

        unmount();

        expect(usePostServicesMock.abortAll).toHaveBeenCalled();
    });
});