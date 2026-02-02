import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
        deletePost,
        likePost,
        unlikePost,
        abortAll,
    })
}));

const ERR_MSG = {
    DELETE_POST: "Rejected deletePost call!",
    LIKE_POST: "Rejected likePost call!",
    UNLIKE_POST: "Rejected unlikePost call!",
};

const isUser = "userId";

const setAlert = vi.fn();

const totalPosts = [
    { _id: "1" },
    { _id: "2" },
];
const setTotalPosts = vi.fn();

const deletePost = vi.fn();
const likePost = vi.fn();
const unlikePost = vi.fn();
const abortAll = vi.fn();

function setup(options = {
    deletePostSuccessfullResolve: true,
    deletePostEmptyReturn: false,
    likePostSuccessfullResolve: true,
    unlikePostSuccessfullResolve: true,
}) {
    if (options.deletePostEmptyReturn) {
        deletePost.mockResolvedValue(null);
    } else if (!options.deletePostSuccessfullResolve) {
        deletePost.mockRejectedValue(new Error(ERR_MSG.DELETE_POST));
    } else {
        deletePost.mockResolvedValue(totalPosts.at(0)._id);
    };

    options.likePostSuccessfullResolve ? likePost.mockResolvedValue(true) : likePost.mockRejectedValue(ERR_MSG.LIKE_POST);
    options.unlikePostSuccessfullResolve ? unlikePost.mockResolvedValue(true) : unlikePost.mockRejectedValue(ERR_MSG.UNLIKE_POST);

    const { unmount } = render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
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
        vi.spyOn(window, "confirm").mockReturnValue(true);

        setup();

        fireEvent.click(screen.getAllByText('Delete').at(0));

        await vi.waitFor(() => {
            expect(deletePost).toHaveBeenCalledOnce();
        });
    });

    it(" does not trigger onDeletePostClickHandler after cancelling delete confirmation", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(false);

        setup();

        fireEvent.click(screen.getAllByText('Delete').at(0));

        await vi.waitFor(() => {
            expect(deletePost).not.toHaveBeenCalled();
        });
    });

    it("triggers setTotalPosts on post deletion", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);

        setup();

        fireEvent.click(screen.getAllByText('Delete').at(0));

        await vi.waitFor(() => {
            expect(deletePost).toHaveBeenCalled();
            expect(setTotalPosts).toHaveBeenCalledOnce();
        });

        const updater = setTotalPosts.mock.calls[0][0];
        const updatedPosts = updater(totalPosts);
        expect(updatedPosts).toEqual([totalPosts.at(1)]);
    });

    it("triggers onLikeClickHandler after click", async () => {
        setup();

        fireEvent.click(screen.getAllByText('Like').at(0));

        await vi.waitFor(() => {
            expect(likePost).toHaveBeenCalledOnce();
        });
    });

    it("triggers onUnlikeClickHandler on click", async () => {
        setup();

        fireEvent.click(screen.getAllByText('Unlike').at(0));

        await vi.waitFor(() => {
            expect(unlikePost).toHaveBeenCalledOnce();
        });
    });

    it("triggers setAlert on error", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);

        setup({
            deletePostEmptyReturn: false,
            deletePostSuccessfullResolve: false,
            likePostSuccessfullResolve: false,
            unlikePostSuccessfullResolve: false,
        });

        fireEvent.click(screen.getAllByText('Delete').at(0));
        fireEvent.click(screen.getAllByText('Like').at(0));
        fireEvent.click(screen.getAllByText('Unlike').at(0));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledTimes(3);
        })
    });

    it("triggers abortAll on unmount", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);

        const { unmount } = setup();

        fireEvent.click(screen.getAllByText('Delete').at(0));
        fireEvent.click(screen.getAllByText('Like').at(0));
        fireEvent.click(screen.getAllByText('Unlike').at(0));

        unmount();

        expect(abortAll).toHaveBeenCalledOnce();
    })
});