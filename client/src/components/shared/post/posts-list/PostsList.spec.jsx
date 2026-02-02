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
                    <button onClick={() => actions.onDeleteClickHandler(postItem._id)}>Delete</button>
                    <button onClick={() => actions.onLikeClickHandler(postItem._id)}>Like</button>
                    <button onClick={() => actions.onUnlikeClickHandler(postItem._id)}>Unlike</button>
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

    options.likePostSuccessfullResolve ? usePostServicesMock.likePost.mockResolvedValue(true) : usePostServicesMock.likePost.mockRejectedValue(ERR_MSG.LIKE_POST);
    options.unlikePostSuccessfullResolve ? usePostServicesMock.unlikePost.mockResolvedValue(true) : usePostServicesMock.unlikePost.mockRejectedValue(ERR_MSG.UNLIKE_POST);

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

    it("triggers onDeletePostClickHandler after delete confirmation", async () => {
        const user = userEvent.setup();
        setup();

        vi.spyOn(window, "confirm").mockReturnValue(true);

        await user.click(screen.getAllByText('Delete').at(0));

        await vi.waitFor(() => {
            expect(usePostServicesMock.deletePost).toHaveBeenCalledOnce();
        });
    });

    it(" does not trigger onDeletePostClickHandler after cancelling delete confirmation", async () => {
        const user = userEvent.setup();
        setup();

        vi.spyOn(window, "confirm").mockReturnValue(false);

        await user.click(screen.getAllByText('Delete').at(0));

        await vi.waitFor(() => {
            expect(usePostServicesMock.deletePost).not.toHaveBeenCalled();
        });
    });

    it("triggers setTotalPosts on post deletion", async () => {
        const user = userEvent.setup();
        setup();

        vi.spyOn(window, "confirm").mockReturnValue(true);

        await user.click(screen.getAllByText('Delete').at(0));

        await vi.waitFor(() => {
            expect(usePostServicesMock.deletePost).toHaveBeenCalled();
            expect(totalPostsCtxMock.setTotalPosts).toHaveBeenCalledOnce();
        });

        const updater = totalPostsCtxMock.setTotalPosts.mock.calls[0][0];
        const updatedPosts = updater(totalPostsCtxMock.totalPosts);
        expect(updatedPosts).toEqual([totalPostsCtxMock.totalPosts.at(1)]);
    });

    it("triggers onLikeClickHandler after click", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getAllByText('Like').at(0));

        await vi.waitFor(() => {
            expect(usePostServicesMock.likePost).toHaveBeenCalledOnce();
        });
    });

    it("triggers onUnlikeClickHandler on click", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getAllByText('Unlike').at(0));

        await vi.waitFor(() => {
            expect(usePostServicesMock.unlikePost).toHaveBeenCalledOnce();
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

    it("triggers abortAll on unmount", async () => {
        const user = userEvent.setup();
        const { unmount } = setup();

        vi.spyOn(window, "confirm").mockReturnValue(true);

        await user.click(screen.getAllByText('Delete').at(0));
        await user.click(screen.getAllByText('Like').at(0));
        await user.click(screen.getAllByText('Unlike').at(0));

        unmount();

        expect(usePostServicesMock.abortAll).toHaveBeenCalledOnce();
    });
});