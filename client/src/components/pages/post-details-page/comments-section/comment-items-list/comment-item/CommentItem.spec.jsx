import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CommentItem from "./CommentItem";

import { ActionsContext } from "../../../../../../contexts/actions-context";

vi.mock("./comment-item-header/CommentItemHeader", () => ({
    default: ({ comment }) => <div data-testid="comment-item-header">{mockProps.comment.text}</div>
}))

vi.mock("./comment-edit-textarea/CommentEditTextArea", () => ({
    default: () => <div data-testid="comment-edit-text-area"></div>
}));

vi.mock("./comment-text/CommentText", () => ({
    default: () => <div data-testid="comment-text"></div>
}));

vi.mock("./comment-buttons/CommentButtons", () => ({
    default: ({ comment }) => <div data-testid="comment-button">{mockProps.comment.text}</div>
}))

const mockProps = {
    comment: {
        text: "This is a mockProps.comment."
    },
};

const setCommentText = vi.fn();
const setOnEditCommentText = vi.fn();

function setup(options = {
    isEditClicked: true,
}) {
    const isEditClicked = options.isEditClicked || false;

    render(
        <ActionsContext.Provider value={{
            isEditClicked,
            setCommentText,
            setOnEditCommentText
        }}>
            <CommentItem {...mockProps} />
        </ActionsContext.Provider>
    );
};

describe("CommentItem component", () => {
    it("renders CommentItemHeader with passed props", () => {
        setup();

        expect(screen.getByTestId("comment-item-header")).toHaveTextContent(mockProps.comment.text);
    });

    it("renders CommentButtons with passed props", () => {
        setup();

        expect(screen.getByTestId("comment-button")).toHaveTextContent(mockProps.comment.text);
    });

    it.each([
        { renderedComp: "CommentText", isEditClicked: false },
        { renderedComp: "CommentEditTextArea", isEditClicked: true },
    ])("renders $renderedComp on isEditClicked $isEditClicked", ({ isEditClicked }) => {

        setup({
            isEditClicked
        });

        if (isEditClicked) {
            expect(screen.getByTestId("comment-edit-text-area")).toBeInTheDocument();
            expect(screen.queryByTestId("comment-text")).not.toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("comment-edit-text-area")).not.toBeInTheDocument();
            expect(screen.getByTestId("comment-text")).toBeInTheDocument();
        };
    });
});