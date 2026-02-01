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

const post = {
    _id: "postId",
    owner: {
        _id: "userId"
    }
};

let isUser = "userId";

describe("PostButtons component", () => {
    it("renders PostInteractionButtons component", () => {
        render(
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ post }}>
                    <PostButtons />
                </PostContext.Provider>
            </UserContext.Provider>
        );

        expect(screen.getByTestId("interaction-button")).toBeInTheDocument();
    });

    it("renders owner buttons on matching isUser and post owner id", () => {
        render(
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ post }}>
                    <PostButtons />
                </PostContext.Provider>
            </UserContext.Provider>
        );

        expect(screen.getByTestId("owner-button")).toBeInTheDocument();
        expect(screen.getByTestId("owner-button")).toHaveTextContent(`/post/${post._id}/edit`);
    });

    it("does not render owner buttons on falsy isUser", () => {
        isUser = '';

        render(
            <UserContext.Provider value={{ isUser }}>
                <PostContext.Provider value={{ post }}>
                    <PostButtons />
                </PostContext.Provider>
            </UserContext.Provider>
        );

        expect(screen.queryByTestId('owner-button')).not.toBeInTheDocument();
    });
});