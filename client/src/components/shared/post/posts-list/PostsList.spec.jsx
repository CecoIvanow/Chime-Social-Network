import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import PostsList from "./PostsList";

import { AlertContext } from "../../../../contexts/alert-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";
import { UserContext } from "../../../../contexts/user-context";
import usePostServices from "../../../../hooks/usePostServices";
import { ActionsContext } from "../../../../contexts/actions-context";

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

vi.mock("../../../../hooks/usePostServices");

describe("PostsList component", () => {
    const setAlert = vi.fn();

    const isUser = "userId";

    const setTotalPosts = vi.fn();
    const totalPosts = [
        { _id: "1" },
        { _id: "2" },
    ];

    const deletePost = vi.fn();
    const likePost = vi.fn();
    const unlikePost = vi.fn();
    const abortAll = vi.fn();

    beforeEach(() => {
        usePostServices.mockReturnValue({
            deletePost,
            likePost,
            unlikePost,
            abortAll,
        });
    })

    it("renders PostItem for each post ", () => {
        render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
                        <PostsList />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        expect(screen.getAllByTestId("post-item")).toHaveLength(2);
    });

    it("triggers onDeletePostClickHandler after delete confirmation", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);

        render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
                        <PostsList />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        fireEvent.click(screen.getAllByText('Delete').at(0));

        await vi.waitFor(() => {
            expect(deletePost).toHaveBeenCalledOnce();
        });
    });

    it(" does not trigger onDeletePostClickHandler after cancelling delete confirmation", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(false);

        render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
                        <PostsList />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        fireEvent.click(screen.getAllByText('Delete').at(0));

        await vi.waitFor(() => {
            expect(deletePost).not.toHaveBeenCalled();
        });
    });

    it("triggers setTotalPosts on post deletion", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);

        deletePost.mockResolvedValueOnce("1");

        render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
                        <PostsList />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        fireEvent.click(screen.getAllByText('Delete').at(0));

        await vi.waitFor(() => {
            expect(deletePost).toHaveBeenCalled();
            expect(setTotalPosts).toHaveBeenCalledOnce();
        });

        const updater = setTotalPosts.mock.calls[0][0]
        const updatedPosts = updater(totalPosts);
        expect(updatedPosts).toEqual([{ _id: "2" }]);
    });

    it("triggers onLikeClickHandler after click", async () => {
        render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
                        <PostsList />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        fireEvent.click(screen.getAllByText('Like').at(0));

        await vi.waitFor(() => {
            expect(likePost).toHaveBeenCalledOnce();
        });
    });

    it("triggers onUnlikeClickHandler on click", async () => {
        render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
                        <PostsList />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        fireEvent.click(screen.getAllByText('Unlike').at(0));

        await vi.waitFor(() => {
            expect(unlikePost).toHaveBeenCalledOnce();
        });
    });

    it("triggers setAlert on error", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);

        unlikePost.mockRejectedValueOnce(new Error('Error'));
        likePost.mockRejectedValueOnce(new Error('Error'));
        deletePost.mockRejectedValueOnce(new Error('Error'));

        render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
                        <PostsList />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        fireEvent.click(screen.getAllByText('Delete').at(0));
        fireEvent.click(screen.getAllByText('Like').at(0));
        fireEvent.click(screen.getAllByText('Unlike').at(0));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledTimes(3);
        })
    });

    it("triggers abortAll on unmount", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);

        const { unmount } = render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
                        <PostsList />
                    </TotalPostsContext.Provider>
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        fireEvent.click(screen.getAllByText('Delete').at(0));
        fireEvent.click(screen.getAllByText('Like').at(0));
        fireEvent.click(screen.getAllByText('Unlike').at(0));

        unmount();

        expect(abortAll).toHaveBeenCalledOnce();
    })
});