import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CommentEditTextArea from "./CommentEditTextArea";

import { ActionsContext } from "../../../../../../../contexts/actions-context";

const PLACEHOLDER_TEXT = "Edit your post content..."

const onEditCommentText = "Comment content!";
const onTextChangeHandler = vi.fn();

function setup() {
    render(
        <ActionsContext.Provider value={{ onEditCommentText, onTextChangeHandler, }}>
            <CommentEditTextArea />
        </ActionsContext.Provider>
    );
};

describe("CommentEditTextArea component", () => {
    beforeEach(() => {
        setup();
    });

    it("renders component with context values", () => {
        expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", PLACEHOLDER_TEXT);
        expect(screen.getByRole("textbox")).toHaveValue(onEditCommentText);
    })
});