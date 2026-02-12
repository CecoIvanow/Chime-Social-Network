import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import { ActionsContext } from "../../../../../../../contexts/actions-context";

import CommentText from "./CommentText";

const actionsCtxCommentText = "Comment text content!";

function setup() {
    render(
        <ActionsContext.Provider value={{ commentText: actionsCtxCommentText }}>
            <CommentText />
        </ActionsContext.Provider>
    );
};

describe("CommentText component", () => {
    beforeEach(() => {
        setup();
    });

    it("renders component with commentText context value", () => {
        expect(screen.getByText(actionsCtxCommentText)).toBeInTheDocument();
    });
});