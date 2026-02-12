import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import { ActionsContext } from "../../../../../../../contexts/actions-context";

import CommentText from "./CommentText";

const COMMENT_TEXT = "Comment text content!";

function setup() {
    render(
        <ActionsContext.Provider value={{ commentText: COMMENT_TEXT }}>
            <CommentText />
        </ActionsContext.Provider>
    );
};

describe("CommentText component", () => {
    beforeEach(() => {
        setup();
    });

    it("renders component with commentText context value", () => {
        expect(screen.getByText(COMMENT_TEXT)).toBeInTheDocument();
    });
});