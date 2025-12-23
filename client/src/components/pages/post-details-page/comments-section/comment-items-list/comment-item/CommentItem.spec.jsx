import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CommentItem from "./CommentItem";

import { ActionsContext } from "../../../../../../contexts/actions-context";

vi.mock("./comment-item-header/CommentItemHeader", () => ({
    default: ({ comment }) => <div data-testid="comment-item-header">{comment.text}</div>
}))

vi.mock("./comment-edit-textarea/CommentEditTextArea", () => ({
    default: () => <div data-testid="comment-edit-text-area"></div>
}));

vi.mock("./comment-text/CommentText", () => ({
    default: () => <div data-testid="comment-text"></div>
}));

vi.mock("./comment-buttons/CommentButtons", () => ({
    default: ({ comment }) => <div data-testid="comment-button">{comment.text}</div>
}))

const comment = {
    text: "This is a comment."
};

const isEditClicked = false;
const setCommentText = vi.fn();
const setOnEditCommentText = vi.fn();

function setup(options = {
    isEditClicked,
}) {
    const isEditClicked = options.isEditClicked || false;

    render(
        <ActionsContext.Provider value={{
            isEditClicked,
            setCommentText,
            setOnEditCommentText
        }}>
            <CommentItem comment={comment} />
        </ActionsContext.Provider>
    );
};

describe("CommentItem component", () => {
    it("renders CommentItemHeader with passed props", () => {
        setup();

        expect(screen.getByTestId("comment-item-header")).toHaveTextContent(comment.text);
    });

    it("renders CommentButtons with passed props", () => {
        setup();

        expect(screen.getByTestId("comment-button")).toHaveTextContent(comment.text);
    });
});