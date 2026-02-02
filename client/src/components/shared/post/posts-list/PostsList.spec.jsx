import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../contexts/actions-context";
import { AlertContext } from "../../../../contexts/alert-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";
import { UserContext } from "../../../../contexts/user-context";

import PostsList from "./PostsList";

vi.mock("./post-item/PostItem", () => ({
    default: ({ postItem }) => (
        <ActionsContext.Consumer>
            {actions => (
                <div data-testid="post-item">
                    <button onClick={() => actions.onDeleteClickHandler(postItem)}>Delete</button>
                    <button onClick={() => actions.onLikeClickHandler(postItem)}>Like</button>
                    <button onClick={() => actions.onUnlikeClickHandler(postItem)}>Unlike</button>
                </div>
            )}
        </ActionsContext.Consumer>
    )
}));

vi.mock("../../../../hooks/usePostServices", () => ({
    default: () => ({
        ...usePostServicesMock
    })
}));

const FIRST_POST = 0;
const SECOND_POST= 1;

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
    ], setTotalPosts: vi.fn(),
}

const usePostServicesMock = {
    deletePost: vi.fn(),
    likePost: vi.fn(),
    unlikePost: vi.fn(),
    abortAll: vi.fn(),
}

function setup(options = {
    deleteConfirmation : true,
    deletePostSuccessfullResolve: true,
    deletePostEmptyReturn: false,
    likePostSuccessfullResolve: true,
    unlikePostSuccessfullResolve: true,
}) {
    if (options.deletePostEmptyReturn) {
        usePostServicesMock.deletePost.mockResolvedValue(null);
    } else if (!options.deletePostSuccessfullResolve) {
        usePostServicesMock.deletePost.mockRejectedValue(new Error(ERR_MSG.DELETE_POST));
    } else {
        usePostServicesMock.deletePost.mockResolvedValue(totalPostsCtxMock.totalPosts.at(0)._id);
    };

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
    it("renders PostItem for each post ", () => {
        setup();

        expect(screen.getAllByTestId("post-item")).toHaveLength(2);
    });

    it.each([
        { name: "deletes post after deletePost user confirmation", shouldTrigger: true, deleteConfirmation: true },
        { name: "does not delete post after deletePost user rejection", shouldTrigger: false, deleteConfirmation: false },
    ])("$name", async ({ shouldTrigger, deleteConfirmation }) => {
        const user = userEvent.setup();
        setup({
            deleteConfirmation,
            deletePostEmptyReturn: false,
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

    it("triggers like action when Like button is clicked", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getAllByText('Like').at(FIRST_POST));

        await vi.waitFor(() => {
            expect(usePostServicesMock.likePost).toHaveBeenCalledWith(isUser, totalPostsCtxMock.totalPosts.at(FIRST_POST)._id);
        });
    });

    it("shows alert when like action is rejected", async () => {
        const user = userEvent.setup();
        setup({
            deleteConfirmation: true,
            deletePostEmptyReturn: false,
            deletePostSuccessfullResolve: true,
            likePostSuccessfullResolve: false,
            unlikePostSuccessfullResolve: true
        });

        await user.click(screen.getAllByText('Like').at(FIRST_POST));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.LIKE_POST);
        });
    });

    it("triggers unlike action when Unlike button is clicked", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getAllByText('Unlike').at(FIRST_POST));

        await vi.waitFor(() => {
            expect(usePostServicesMock.unlikePost).toHaveBeenCalledWith(isUser, totalPostsCtxMock.totalPosts.at(FIRST_POST)._id);
        });
    });

    it("shows alert when unlike action is rejected", async () => {
        const user = userEvent.setup();
        setup({
            deleteConfirmation: true,
            deletePostEmptyReturn: false,
            deletePostSuccessfullResolve: true,
            likePostSuccessfullResolve: true,
            unlikePostSuccessfullResolve: false
        });

        await user.click(screen.getAllByText('Unlike').at(FIRST_POST));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.UNLIKE_POST);
        });
    });

    it("triggers setAlert on error", async () => {
        const user = userEvent.setup();
        setup({
            deletePostEmptyReturn: false,
            deletePostSuccessfullResolve: false,
            likePostSuccessfullResolve: false,
            unlikePostSuccessfullResolve: false,
        });

        vi.spyOn(window, "confirm").mockReturnValue(true);

        await user.click(screen.getAllByText('Delete').at(0));
        await user.click(screen.getAllByText('Like').at(0));
        await user.click(screen.getAllByText('Unlike').at(0));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledTimes(3);
        })
    });
});