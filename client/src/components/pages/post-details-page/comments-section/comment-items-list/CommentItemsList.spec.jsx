import { useContext } from "react";

import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../../contexts/actions-context";
import { AlertContext } from "../../../../../contexts/alert-context";
import { PostContext } from "../../../../../contexts/post-context";

import CommentItemsList from "./CommentItemsList";

vi.mock("./comment-item/CommentItem", () => ({
    default: function CommentItem({ comment }) {
        const actions = useContext(ActionsContext);

        return <>
            <input
                onChange={(e) => actions.onTextChangeHandler(e)}
                data-testid="comment-content"
                value={actions.onEditCommentText || comment.content}
            />
            {actions.isEditClicked ? <>
                <button
                    onClick={() => actions.onSaveEditClickHandler(comment._id)}
                >
                    Save
                </button>
                <button
                    onClick={() => actions.onCancelEditClickHandler()}
                >
                    Cancel
                </button>
            </> : <>
                <button
                    onClick={() => actions.onEditClickHandler()}
                >
                    Edit
                </button>
            </>}

            <button
                onClick={() => actions.onDeleteClickHandler(comment._id)}
            >
                Delete
            </button>
        </>
    }
}));

vi.mock("../../../../../hooks/useCommentServices", () => ({
    default: () => ({
        ...useCommentServicesMock
    })
}));

const TEST_COMMENT_INDEX = 0;
const ERR_MSG = {
    UPDATE_COMMENT: "Rejected comment update!",
    DELETE_COMMENT: "Rejected comment deletion!",
};

const commentTextAddition = ", testing!";

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
    updateCommentEmptyReturn: false
}) {
    if (!options.updateCommentSuccess) {
        useCommentServicesMock.updateComment.mockRejectedValue(new Error(ERR_MSG.UPDATE_COMMENT));
    } else if (options.updateCommentEmptyReturn) {
        useCommentServicesMock.updateComment.mockResolvedValue(null);
    } else {
        useCommentServicesMock.updateComment.mockResolvedValue(commentTextAddition);
    }

    options.deleteCommentSuccess ?
        useCommentServicesMock.deleteComment.mockResolvedValue(TEST_COMMENT_INDEX) :
        useCommentServicesMock.deleteComment.mockRejectedValue(new Error(ERR_MSG.DELETE_COMMENT));

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
    const finalCommentTextValue = postCtxMock.post.comments.at(TEST_COMMENT_INDEX).content + commentTextAddition;

    it("renders correct number of comments", () => {
        setup();

        for (let i = 0; i < postCtxMock.post.comments.length; i++) {
            expect(screen.getAllByTestId("comment-content")[i]).toHaveValue(postCtxMock.post.comments.at(i).content);
        };
    });

    it("deletes chosen comment after delete confirm window", async () => {
        const user = userEvent.setup();
        setup();

        vi.spyOn(window, "confirm").mockReturnValue(true);

        await user.click(screen.getAllByRole("button", { name: "Delete" })[TEST_COMMENT_INDEX]);

        const updater = postCtxMock.setPost.mock.calls[0][0];
        const result = updater(postCtxMock.post);

        await waitFor(() => {
            expect(useCommentServicesMock.deleteComment).toHaveBeenCalledWith(TEST_COMMENT_INDEX);
            expect(postCtxMock.setPost).toHaveBeenCalledWith(updater);
        });

        expect(result.comments).toHaveLength(0);
    });

    it("does not delete comment after rejected delete confirm window", async () => {
        const user = userEvent.setup();
        setup();

        vi.spyOn(window, "confirm").mockReturnValue(false);

        await user.click(screen.getAllByRole("button", { name: "Delete" })[TEST_COMMENT_INDEX]);

        expect(useCommentServicesMock.deleteComment).not.toHaveBeenCalledWith();
        expect(postCtxMock.setPost).not.toHaveBeenCalled();
    });

    it("shows error message on a rejected comment deletion call", async () => {
        const user = userEvent.setup();
        setup({
            deleteCommentSuccess: false,
            updateCommentSuccess: true,
            updateCommentEmptyReturn: false,
        });

        vi.spyOn(window, "confirm").mockReturnValue(true);

        await user.click(screen.getAllByRole("button", { name: "Delete" })[TEST_COMMENT_INDEX]);

        await waitFor(() => {
            expect(useCommentServicesMock.deleteComment).toHaveBeenCalledWith(TEST_COMMENT_INDEX);
            expect(setAlert).toHaveBeenCalled();
        });
    });

    it("renders edit button", () => {
        setup();

        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();

        expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
    });

    it("hides edit button and renders input field and save and cancel buttons after edit has been clicked", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Edit" }));

        expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();

        expect(screen.getByTestId("comment-content")).toHaveValue(postCtxMock.post.comments.at(0).content);
        expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });

    it("comment text gets updated on user typing", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Edit" }));
        user.type(screen.getByTestId("comment-content"), commentTextAddition);

        await waitFor(() => {
            expect(screen.getByTestId("comment-content")).toHaveValue(finalCommentTextValue);
        })
    });

    it("clicking on the cancel button reverts the comment text to the original content", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Edit" }));
        await user.type(screen.getByTestId("comment-content"), commentTextAddition);

        expect(screen.getByTestId("comment-content")).toHaveValue(finalCommentTextValue);

        await user.click(screen.getByRole("button", { name: "Cancel" }));

        expect(screen.getByTestId("comment-content")).toHaveValue(postCtxMock.post.comments.at(TEST_COMMENT_INDEX).content);
    });

    it("updates comment text after clicking the save button", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Edit" }));
        await user.type(screen.getByTestId("comment-content"), commentTextAddition);

        expect(screen.getByTestId("comment-content")).toHaveValue(finalCommentTextValue);

        await user.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => {
            expect(useCommentServicesMock.updateComment).toHaveBeenCalledWith(TEST_COMMENT_INDEX, finalCommentTextValue);
            expect(screen.getByTestId("comment-content")).toHaveValue(commentTextAddition);
        });
    });

    it("shows error message on a rejected comment update call", async () => {
        const user = userEvent.setup();
        setup({
            deleteCommentSuccess: true,
            updateCommentSuccess: false,
            updateCommentEmptyReturn: false,
        });

        await user.click(screen.getByRole("button", { name: "Edit" }));
        await user.type(screen.getByTestId("comment-content"), commentTextAddition);

        expect(screen.getByTestId("comment-content")).toHaveValue(finalCommentTextValue);

        await user.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalled();
        });
    });

    it("does nothing when updated comment returns empty", async () => {
        const user = userEvent.setup();
        setup({
            deleteCommentSuccess: true,
            updateCommentSuccess: true,
            updateCommentEmptyReturn: true,
        });

        await user.click(screen.getByRole("button", { name: "Edit" }));
        await user.type(screen.getByTestId("comment-content"), commentTextAddition);

        expect(screen.getByTestId("comment-content")).toHaveValue(finalCommentTextValue);

        await user.click(screen.getByRole("button", { name: "Save" }));

        await waitFor(() => {
            expect(useCommentServicesMock.updateComment).toHaveBeenCalledWith(TEST_COMMENT_INDEX, finalCommentTextValue);
            expect(screen.getByTestId("comment-content")).toHaveValue(finalCommentTextValue);
        });
    });

    it("stops all ongoing calls on unmount", () => {
        const unmount = setup();

        unmount();
        expect(useCommentServicesMock.abortAll).toHaveBeenCalled();
    });
});