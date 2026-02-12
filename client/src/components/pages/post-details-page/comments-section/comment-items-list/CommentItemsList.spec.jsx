import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../../contexts/actions-context";
import { AlertContext } from "../../../../../contexts/alert-context";
import { PostContext } from "../../../../../contexts/post-context";

import CommentItemsList from "./CommentItemsList";

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
        ...useCommentServicesMock
    })
}));

const TEST_COMMENT = 0;
const NEW_COMMENT_CONTENT = "The comment content has changed";

const useCommentServicesMock = {
    updateComment: vi.fn(),
    deleteComment: vi.fn(),
    abortAll: vi.fn(),
};

const setAlert = vi.fn();

const postCtxMock = {
    setPost: vi.fn(),
    post: {
        comments: [
            { _id: 0, content: "Comment One" },
        ],
    }
};

function setup(options = {
    deleteCommentSuccess: true,
    updateCommentSuccess: true,
    updateCommentTruthyReturn: true
}) {
    if (!options.updateCommentSuccess) {
        useCommentServicesMock.updateComment.mockRejectedValue(new Error("Successfully rejected comment update!"));
    } else if (!options.updateCommentTruthyReturn) {
        useCommentServicesMock.updateComment.mockResolvedValue(""); // falsy value
    } else {
        useCommentServicesMock.updateComment.mockResolvedValue(NEW_COMMENT_CONTENT);
    }

    options.deleteCommentSuccess ?
        useCommentServicesMock.deleteComment.mockResolvedValue(TEST_COMMENT) :
        useCommentServicesMock.deleteComment.mockRejectedValue(new Error("Successfully rejected delete comment!"));

    const { unmount } = render(
        <AlertContext.Provider value={{ setAlert }}>
            <PostContext.Provider value={{ ...postCtxMock }}>
                <CommentItemsList />
            </PostContext.Provider>
        </AlertContext.Provider>
    );

    return unmount;
};

describe("CommentItemsList", () => {
    it("renders CommentItem with passed props", () => {
        setup();

        for (let i = 0; i < postCtxMock.post.comments.length; i++) {
            expect(screen.getAllByTestId("comment-content")[i]).toHaveValue(postCtxMock.post.comments.at(i).content);
        };
    });

    it("deletes comment on onDeleteClickHandler trigger with confirm true", async () => {
        setup();
        vi.spyOn(window, "confirm").mockReturnValue(true);

        fireEvent.click(screen.getAllByTestId("delete-button")[TEST_COMMENT]);

        await waitFor(() => {
            const updater = postCtxMock.setPost.mock.calls[0][0];
            const result = updater(postCtxMock.post);

            expect(useCommentServicesMock.deleteComment).toHaveBeenCalledWith(TEST_COMMENT);
            expect(postCtxMock.setPost).toHaveBeenCalledWith(updater);
            expect(result.comments).toHaveLength(0);
        });
    });

    it("does not delete comment on onDeleteClickHandler trigger with confirm false", async () => {
        setup();
        vi.spyOn(window, "confirm").mockReturnValue(false);

        fireEvent.click(screen.getAllByTestId("delete-button")[TEST_COMMENT]);

        await waitFor(() => {
            expect(useCommentServicesMock.deleteComment).not.toHaveBeenCalledWith();
            expect(postCtxMock.setPost).not.toHaveBeenCalled();
        })
    });

    it("triggers setAlert on deleteComment rejectred call", async () => {
        setup({
            deleteCommentSuccess: false,
            updateCommentSuccess: true,
            updateCommentTruthyReturn: true
        });

        vi.spyOn(window, "confirm").mockReturnValue(true);

        fireEvent.click(screen.getAllByTestId("delete-button")[TEST_COMMENT]);

        await waitFor(() => {
            expect(useCommentServicesMock.deleteComment).toHaveBeenCalledWith(TEST_COMMENT);
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

        expect(screen.getByTestId("comment-content")).toHaveValue(postCtxMock.post.comments.at(0).content);
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

        expect(screen.getByTestId("comment-content")).toHaveValue(postCtxMock.post.comments.at(0).content);
    });

    it("saves new content on successfull save button click", async () => {
        setup();

        fireEvent.click(screen.getByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("comment-content"), { target: { value: NEW_COMMENT_CONTENT } });

        expect(screen.getByTestId("comment-content")).toHaveValue(NEW_COMMENT_CONTENT);

        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(useCommentServicesMock.updateComment).toHaveBeenCalledWith(TEST_COMMENT, NEW_COMMENT_CONTENT);
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
            updateCommentTruthyReturn: true
        });

        fireEvent.click(screen.getByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("comment-content"), { target: { value: NEW_COMMENT_CONTENT } });

        expect(screen.getByTestId("comment-content")).toHaveValue(NEW_COMMENT_CONTENT);

        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalled();
        });
    });
    
    it("does NOT exit edit mode when updateComment returns falsy value", async () => {
        setup({
            deleteCommentSuccess: true,
            updateCommentSuccess: true,
            updateCommentTruthyReturn: false
        });

        fireEvent.click(screen.getByTestId("edit-button"));
        fireEvent.change(screen.getByTestId("comment-content"), { target: { value: NEW_COMMENT_CONTENT } });

        expect(screen.getByTestId("comment-content")).toHaveValue(NEW_COMMENT_CONTENT);

        fireEvent.click(screen.getByTestId("save-button"));

        await waitFor(() => {
            expect(useCommentServicesMock.updateComment).toHaveBeenCalledWith(TEST_COMMENT, NEW_COMMENT_CONTENT);
            expect(screen.getByTestId("comment-content")).toHaveValue(NEW_COMMENT_CONTENT);
            expect(screen.getByTestId("save-button")).toBeInTheDocument();
            expect(screen.getByTestId("cancel-button")).toBeInTheDocument();
            expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
        });
    });

    it("triggers abortAll on unmount", () => {
        const unmount = setup();

        unmount();

        expect(useCommentServicesMock.abortAll).toHaveBeenCalled();
    });
});