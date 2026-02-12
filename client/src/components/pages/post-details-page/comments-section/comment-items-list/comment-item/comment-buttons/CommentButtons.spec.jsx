import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../../../../../../contexts/user-context";

import CommentButtons from "./CommentButtons";

vi.mock("../../../../../../shared/controls/owner-buttons/OwnerButtons", () => ({
    default: ({ itemId }) => <div data-testid="owner-buttons">{itemId}</div>
}));

const mockProps = {
    comment: {
        _id: "commentId",
        owner: {
            _id: "ownerId",
        },
    }
};

function setup(options = {
    isTheOwner: true
}) {
    const isUser = options.isTheOwner ? mockProps.comment.owner._id : "userId";

    render(
        <UserContext.Provider value={{ isUser }}>
            <CommentButtons {...mockProps} />
        </UserContext.Provider>
    );
};

describe("CommentButtons component", () => {
    it("renders the owner buttons when the user is logged in and the owner", () => {
        setup();

        expect(screen.getByTestId("owner-buttons")).toHaveTextContent(mockProps.comment._id);
    });

    it("does not render the owner buttons when the logged in user is not the owner", () => {
        setup({
            isTheOwner: false
        });

        expect(screen.queryByTestId("owner-buttons")).not.toBeInTheDocument();
    });
});