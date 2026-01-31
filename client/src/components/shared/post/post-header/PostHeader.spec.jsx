import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import { PostContext } from "../../../../contexts/post-context.js";

import PostHeader from "./PostHeader.jsx";

const post = {
    owner: {
        _id: "owner123",
        imageUrl: "https://example.org/test-123",
        firstName: "John",
        lastName: "Doe",
    },
    _id: "post056",
    postedOn: "02.05.2025",
};

beforeEach(() => {
    render(
        <MemoryRouter>
            <PostContext.Provider value={{ post }}>
                <PostHeader />
            </PostContext.Provider>
        </MemoryRouter>
    );
});

describe("PostHeader component", () => {
    it("renders with post data", () => {
        expect(screen.getByRole("img")).toHaveAttribute("src", post.owner.imageUrl);

        expect(screen.getByRole("link", { name: `${post.owner.firstName} ${post.owner.lastName}` })).toHaveAttribute("href", `/profile/${post.owner._id}`);

        expect(screen.getByRole("link", { name: `Posted on ${post.postedOn}` })).toHaveAttribute("href", `/post/${post._id}/details`);
    });
});