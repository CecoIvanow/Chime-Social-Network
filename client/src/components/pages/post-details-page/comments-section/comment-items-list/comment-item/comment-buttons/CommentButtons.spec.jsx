import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../../../../../../contexts/user-context";

import CommentButtons from "./CommentButtons";

vi.mock("../../../../../../shared/controls/owner-buttons/OwnerButtons", () => ({
    default: ({ itemId }) => <button data-testid="owner-button">{itemId}</button>
}));

const comment = {
    _id: "commentId",
    owner: {
        _id: "ownerId",
    },
};

function setup(options = {
    matchingIds: true
}) {
    const isUser = options.matchingIds ? comment.owner._id : "userId";

    render(
        <UserContext.Provider value={{ isUser }}>
            <CommentButtons comment={comment} />
        </UserContext.Provider>
    );
};

describe("CommentButtons component", () => {
    it("renders OwnerButtons with passed props on matchimg isUser and owner id", () => {
        setup();

        expect(screen.getByTestId("owner-button")).toHaveTextContent(comment._id);
    });

    it("does not render OwnerButtons on different isUser and owner id", () => {
        setup({
            matchingIds: false
        });

        expect(screen.queryByTestId("owner-button")).not.toBeInTheDocument();
    });
});