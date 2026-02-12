import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ActionsContext } from "../../../../../../../contexts/actions-context";

import CommentEditTextArea from "./CommentEditTextArea";

const PLACEHOLDER_TEXT = "Edit your post content..."

const actionsContextMock = {
    onEditCommentText: "Comment content!",
    onTextChangeHandler: vi.fn(),
};

beforeEach(() => {
    render(
        <ActionsContext.Provider value={{ ...actionsContextMock }}>
            <CommentEditTextArea />
        </ActionsContext.Provider>
    );
});

describe("CommentEditTextArea component", () => {
    it("renders component with context values", () => {
        expect(screen.getByRole("textbox", { value: actionsContextMock.onEditCommentText })).toHaveAttribute("placeholder", PLACEHOLDER_TEXT);
    });

    it("triggers onTextChangeHandler on value change", async () => {
        const user = userEvent.setup();

        const newValue = "Test!";
        
        await user.type(screen.getByRole("textbox"), newValue);
        expect(actionsContextMock.onTextChangeHandler).toHaveBeenCalled();
    });
});