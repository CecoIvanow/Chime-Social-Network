import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import { ActionsContext } from "../../../../../../../contexts/actions-context";

import CommentText from "./CommentText";

const actionsCtxCommentText = "Comment text content!";

beforeEach(() => {
    render(
        <ActionsContext.Provider value={{ commentText: actionsCtxCommentText }}>
            <CommentText />
        </ActionsContext.Provider>
    );
});

describe("CommentText component", () => {
    it("renders with correct comment text value", () => {
        expect(screen.getByText(actionsCtxCommentText)).toBeInTheDocument();
    });
});