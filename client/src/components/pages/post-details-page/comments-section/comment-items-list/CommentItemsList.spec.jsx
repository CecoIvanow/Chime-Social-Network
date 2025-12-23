import { fireEvent, getAllByTestId, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CommentItemsList from "./CommentItemsList";

import { ActionsContext } from "../../../../../contexts/actions-context";
import { PostContext } from "../../../../../contexts/post-context";
import { AlertContext } from "../../../../../contexts/alert-context";

vi.mock("./comment-item/CommentItem", () => ({
    default: ({ comment }) =>
        <ActionsContext.Consumer>
            {actions => <>
                <p
                    onChange={(e) => actions.onTextChangeHandler(e)}
                    data-testid="comment-content"
                >
                    {comment.content}
                </p>
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
                </> : (
                    <button
                        onClick={() => actions.onEditClickHandler()}
                        data-testid="edit-button"
                    >
                        Edit
                    </button>
                )}
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
const CONTROL_COMMENT = 1;

function setup(options = {
    deleteCommentSuccess: true,
}) {
    options.deleteCommentSuccess ?
        deleteCommentMock.mockResolvedValue(TEST_COMMENT) :
        deleteCommentMock.mockRejectedValue(new Error("Successfully rejected delete comment!"));

    render(
        <AlertContext.Provider value={{ setAlert }}>
            <PostContext.Provider value={{ post, setPost }}>
                <CommentItemsList />
            </PostContext.Provider>
        </AlertContext.Provider>
    );
};

describe("CommentItemsList", () => {
    it("renders CommentItem with passed props", () => {
        setup();

        for (let i = 0; i < post.comments.length; i++) {
            expect(screen.getAllByTestId("comment-content")[i]).toHaveTextContent(post.comments.at(i).content);
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
});