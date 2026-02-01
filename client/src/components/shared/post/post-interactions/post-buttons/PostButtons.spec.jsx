import { Link, MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from '../../../../../contexts/user-context'
import { PostContext } from '../../../../../contexts/post-context';

import PostButtons from "./PostButtons";

vi.mock("../../../controls/owner-buttons/OwnerButtons", () => ({
    default: ({ urlLink }) => <Link to={urlLink}></Link>
}));

vi.mock("./post-interaction-buttons/PostInteractionButtons", () => ({
    default: () => <button>{"Comment"}</button>
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
        <MemoryRouter>
            <UserContext.Provider value={{ isUser: isUserMock }}>
                <PostContext.Provider value={{ post }}>
                    <PostButtons />
                </PostContext.Provider>
            </UserContext.Provider>
        </MemoryRouter>
    );
};

describe("PostButtons component", () => {
    it("renders PostInteractionButtons component", () => {
        setup();

        expect(screen.getByRole("button"), { name: "Comment" }).toBeInTheDocument();
    });

    it("renders owner buttons on matching isUser and post owner id", () => {
        setup();

        expect(screen.getByRole("link")).toHaveAttribute("href", `/post/${post._id}/edit`);
    });

    it("does not render owner buttons on falsy isUser", () => {
        setup({
            isUserValueIsEmpty: true,
        });

        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});