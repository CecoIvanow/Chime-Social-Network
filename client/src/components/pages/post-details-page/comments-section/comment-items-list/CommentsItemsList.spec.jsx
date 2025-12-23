import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CommentItemsList from "./CommentItemsList";

import { ActionsContext } from "../../../../../contexts/actions-context";
import { PostContext } from "../../../../../contexts/post-context";
import { AlertContext } from "../../../../../contexts/alert-context";

import useCommentServices from "../../../../../hooks/useCommentServices";

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
                <button
                    onClick={() => actions.onEditClickHandler()}
                    data-testid="edit-button"
                >
                    Edit
                </button>
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
    default:() => ({
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
const post = {
    comments: [
        { _id: 1, content: "Comment One" },
        { _id: 2, content: "Comment Two" },
    ],
};

function setup() {
    render(
        <AlertContext.Provider value={{ setAlert }}>
            <PostContext.Provider value={{ post, setPost }}>
                <CommentItemsList />
            </PostContext.Provider>
        </AlertContext.Provider>
    );
};

describe("CommentItemsList", () => {
    beforeEach(() => {
        setup();
    });

    it("renders CommentItem with passed props", () => {
        for (let i = 0; i < post.comments.length; i++) {
            expect(screen.getAllByTestId("comment-content")[i]).toHaveTextContent(post.comments.at(i).content);
        };
    });
})