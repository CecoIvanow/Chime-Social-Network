import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from '../../../../../contexts/user-context'
import { PostContext } from '../../../../../contexts/post-context';

import PostButtons from "./PostButtons";

vi.mock("../../../controls/owner-buttons/OwnerButtons", () => ({
    default: ({ urlLink }) => <button data-testid="owner-button">{urlLink}</button>
}));

vi.mock("./post-interaction-buttons/PostInteractionButtons", () => ({
    default: () => <button data-testid="interaction-button"></button>
}));

const isUser = "userId";

const post = {
    _id: "postId",
    owner: {
        _id: isUser
    }
};

function setup(options = {
    isUserValueIsEmpty: false,
}) {
    const isUserMock = options.isUserValueIsEmpty ? null : isUser;

    render(
        <UserContext.Provider value={{ isUser: isUserMock }}>
            <PostContext.Provider value={{ post }}>
                <PostButtons />
            </PostContext.Provider>
        </UserContext.Provider>
    );
};

describe("PostButtons component", () => {
    it("renders PostInteractionButtons component", () => {
        setup();

        expect(screen.getByTestId("interaction-button")).toBeInTheDocument();
    });

    it("renders owner buttons on matching isUser and post owner id", () => {
        setup();

        expect(screen.getByTestId("owner-button")).toBeInTheDocument();
        expect(screen.getByTestId("owner-button")).toHaveTextContent(`/post/${post._id}/edit`);
    });

    it("does not render owner buttons on falsy isUser", () => {
        setup({
            isUserValueIsEmpty: true,
        });

        expect(screen.queryByTestId('owner-button')).not.toBeInTheDocument();
    });
});