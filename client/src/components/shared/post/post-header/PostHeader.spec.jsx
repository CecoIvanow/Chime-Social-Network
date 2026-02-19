import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import { PostContext } from "../../../../contexts/post-context.js";

import PostHeader from "./PostHeader.jsx";

const postCtxProps = {
    post: {
        owner: {
            _id: "owner123",
            imageUrl: "https://example.org/test-123",
            firstName: "John",
            lastName: "Doe",
        },
        _id: "post056",
        postedOn: "02.05.2025",
    },
};

beforeEach(() => {
    render(
        <MemoryRouter>
            <PostContext.Provider value={{ ...postCtxProps }}>
                <PostHeader />
            </PostContext.Provider>
        </MemoryRouter>
    );
});

describe("PostHeader component", () => {
    it("renders image with correct src attribute value", () => {
        expect(screen.getByRole("img")).toHaveAttribute("src", postCtxProps.post.owner.imageUrl);
    });

    it("renders posted on link with correct text value and href attribute", () => {
        expect(screen.getByRole("link", { name: `Posted on ${postCtxProps.post.postedOn}` })).toHaveAttribute("href", `/post/${postCtxProps.post._id}/details`);
    });

    it("renders username link with correct text value and href attribute", () => {
        expect(screen.getByRole("link", { name: `${postCtxProps.post.owner.firstName} ${postCtxProps.post.owner.lastName}` })).toHaveAttribute("href", `/profile/${postCtxProps.post.owner._id}`);

    });
});