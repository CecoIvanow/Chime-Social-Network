import { Link, MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { PostContext } from "../../../../../../../contexts/post-context";

import PostCommentButton from "./PostCommentButton";

const post = {
    _id: 1
};

vi.mock("../../../../../../ui/buttons/link-button/LinkButton", () => ({
    default: ({ urlLink, buttonName }) => (
        <Link to={urlLink}>{buttonName}</Link>
    )
}));

beforeEach(() => {
    render(
        <MemoryRouter>
            <PostContext.Provider value={{ post }}>
                <PostCommentButton />
            </PostContext.Provider >
        </MemoryRouter>
    );
});

describe("PostCommentButton component", () => {
    it("renders LinkButton with correct text and href attribute", () => {
        expect(screen.getByRole("link", { name: "Comment" })).toHaveAttribute("href", `/post/${post._id}/details`);
    });
});