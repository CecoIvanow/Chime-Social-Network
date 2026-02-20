import { Link, MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PostContext } from '../../../../../contexts/post-context';
import { UserContext } from '../../../../../contexts/user-context'

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
    it("renders the post interaction buttons", () => {
        setup();

        expect(screen.getByRole("button"), { name: "Comment" }).toBeInTheDocument();
    });

    it("renders the owner buttons when the user is logged in and is the post owner", () => {
        setup();

        expect(screen.getByRole("link")).toHaveAttribute("href", `/post/${post._id}/edit`);
    });

    it("does not render the owner buttons when the user is not logged in", () => {
        setup({
            isUserValueIsEmpty: true,
        });

        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});