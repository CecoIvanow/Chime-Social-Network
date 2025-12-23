import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CommentItemsList from "./CommentItemsList";

import { ActionsContext } from "../../../../../contexts/actions-context";
import { PostContext } from "../../../../../contexts/post-context";
import { AlertContext } from "../../../../../contexts/alert-context";

vi.mock("./comment-item/CommentItem", () => ({
    default: ({ comment }) =>
        <ActionsContext.Consumer>
            {actions => <>
                <input
                    onChange={(e) => actions.onTextChangeHandler(e)}
                    data-testid="comment-content"
                    value={actions.onEditCommentText || comment.content}
                />
                {actions.isEditClicked ? <>
                    <button
                        onClick={() => actions.onSaveEditClickHandler(comment._id)}
                        data-testid="save-button"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => actions.onCancelEditClickHandler()}
                        data-testid="cancel-button"
                    >
                        Cancel
                    </button>
                </> : <>
                    <button
                        onClick={() => actions.onEditClickHandler()}
                        data-testid="edit-button"
                    >
                        Edit
                    </button>
                </>
                }
                <button
                    onClick={() => actions.onDeleteClickHandler(comment._id)}
                    data-testid="delete-button"
                >
                    Delete
                </button>
            </>}
        </ActionsContext.Consumer>
}));

vi.mock("../../../../../hooks/useCommentServices", () => ({
    default: () => ({
        updateComment: updateCommentMock,
        deleteComment: deleteCommentMock,
        abortAll: abortAllMock,
    })
}));

const updateCommentMock = vi.fn();
const deleteCommentMock = vi.fn();
const abortAllMock = vi.fn();

const setAlert = vi.fn();

const setPost = vi.fn();
let post = {
    comments: [
        { _id: 0, content: "Comment One" },
    ],
};

const TEST_COMMENT = 0;
const NEW_COMMENT_CONTENT = "The comment content has changed";

function setup(options = {
    deleteCommentSuccess: true,
    updateCommentSuccess: true,
}) {
    options.updateCommentSuccess ?
        updateCommentMock.mockResolvedValue(NEW_COMMENT_CONTENT) :
        updateCommentMock.mockRejectedValue(new Error("Successfully rejected comment update!"));

    options.deleteCommentSuccess ?
        deleteCommentMock.mockResolvedValue(TEST_COMMENT) :
        deleteCommentMock.mockRejectedValue(new Error("Successfully rejected delete comment!"));

    const { unmount } = render(
        <AlertContext.Provider value={{ setAlert }}>
            <PostContext.Provider value={{ post, setPost }}>
                <CommentItemsList />
            </PostContext.Provider>
        </AlertContext.Provider>
    );

    return unmount;
};

describe("CommentItemsList", () => {
    it("renders CommentItem with passed props", () => {
        setup();

        for (let i = 0; i < post.comments.length; i++) {
            expect(screen.getAllByTestId("comment-content")[i]).toHaveValue(post.comments.at(i).content);
        };
    });

    it("deletes comment on onDeleteClickHandler trigger with confirm true", async () => {
        setup();
        vi.spyOn(window, "confirm").mockReturnValue(true);

        fireEvent.click(screen.getAllByTestId("delete-button")[TEST_COMMENT]);

        await waitFor(() => {
            const updater = setPost.mock.calls[0][0];
            const result = updater(post);

            expect(deleteCommentMock).toHaveBeenCalledWith(TEST_COMMENT);
            expect(setPost).toHaveBeenCalledWith(updater);
            expect(result.comments).toHaveLength(0);
        });
    });

    it("does not delete comment on onDeleteClickHandler trigger with confirm false", async () => {
        setup();
        vi.spyOn(window, "confirm").mockReturnValue(false);

        fireEvent.click(screen.getAllByTestId("delete-button")[TEST_COMMENT]);

        await waitFor(() => {
            expect(deleteCommentMock).not.toHaveBeenCalledWith();
            expect(setPost).not.toHaveBeenCalled();
        })
    });

    it("triggers setAlert on deleteComment rejectred call", async () => {
        setup({
            deleteCommentSuccess: false,
            updateCommentSuccess: true,
        });

        vi.spyOn(window, "confirm").mockReturnValue(true);

        fireEvent.click(screen.getAllByTestId("delete-button")[TEST_COMMENT]);

        await waitFor(() => {
            expect(deleteCommentMock).toHaveBeenCalledWith(TEST_COMMENT);
            expect(setAlert).toHaveBeenCalled();
        });
    });

    it("renders edit buttons when isEditClicked is false", () => {
        setup();

        expect(screen.getByTestId("edit-button")).toBeInTheDocument();

        expect(screen.queryByTestId("cancel-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("save-button")).not.toBeInTheDocument();
    });

    it("on edit button click sets isEditClicked to false and renders cancel and save buttons", () => {
        setup();

        fireEvent.click(screen.getByTestId("edit-button"));

        expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();

        expect(screen.getByTestId("comment-content")).toHaveValue(post.comments.at(0).content);
        expect(screen.getByTestId("save-button")).toBeInTheDocument();
        expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
    });

    it("on input field change triggers onTextChangeHandler", async () => {
        setup();

        fireEvent.click(screen.getByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("comment-content"), { target: { value: NEW_COMMENT_CONTENT } });

        await waitFor(() => {
            expect(screen.getByTestId("comment-content")).toHaveValue(NEW_COMMENT_CONTENT);
        })
    });

    it("on cancel button click sets back original content", () => {
        setup();

        fireEvent.click(screen.getByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("comment-content"), { target: { value: NEW_COMMENT_CONTENT } });

        expect(screen.getByTestId("comment-content")).toHaveValue(NEW_COMMENT_CONTENT);

        fireEvent.click(screen.getByTestId("cancel-button"));

        expect(screen.getByTestId("comment-content")).toHaveValue(post.comments.at(0).content);
    });

    it("saves new content on successfull save button click", async () => {
        setup();

        fireEvent.click(screen.getByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("comment-content"), { target: { value: NEW_COMMENT_CONTENT } });

        expect(screen.getByTestId("comment-content")).toHaveValue(NEW_COMMENT_CONTENT);

        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(updateCommentMock).toHaveBeenCalledWith(TEST_COMMENT, NEW_COMMENT_CONTENT);
            expect(screen.getByTestId("comment-content")).toHaveValue(NEW_COMMENT_CONTENT);
            expect(screen.queryByTestId("save-button")).not.toBeInTheDocument();
            expect(screen.queryByTestId("cancel-button")).not.toBeInTheDocument();
            expect(screen.getByTestId("edit-button")).toBeInTheDocument();
        });
    });

    it("triggers setAlert on rejected updateComment call", async () => {
        setup({
            deleteCommentSuccess: true,
            updateCommentSuccess: false,
        });

        fireEvent.click(screen.getByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("comment-content"), { target: { value: NEW_COMMENT_CONTENT } });

        expect(screen.getByTestId("comment-content")).toHaveValue(NEW_COMMENT_CONTENT);

        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalled();
        });
    });

    it("triggers abortAll on unmount", () => {
        const unmount = setup();

        unmount();

        expect(abortAllMock).toHaveBeenCalled();
    })
});