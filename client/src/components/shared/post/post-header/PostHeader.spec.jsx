import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PostContext } from "../../../../contexts/post-context.js";

import PostHeader from "./PostHeader.jsx";

const postMock = {
    owner: {
        _id: "owner123",
        imageUrl: "https://example.org/test-123",
        firstName: "John",
        lastName: "Doe",
    },
    _id: "post056",
    postedOn: "02.05.2025",
}

describe("PostHeader component", () => {
    it("renders with post data", () => {
        render(
            <MemoryRouter>
                <PostContext.Provider value={{ post: postMock }}>
                    <PostHeader />
                </PostContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByTestId("owner-image")).toHaveAttribute("src", postMock.owner.imageUrl);

        expect(screen.getByTestId("profile-link")).toHaveAttribute("href", `/profile/${postMock.owner._id}`);
        expect(screen.getByTestId("profile-link")).toHaveTextContent(`${postMock.owner.firstName} ${postMock.owner.lastName}`);
        
        expect(screen.getByTestId("post-link")).toHaveAttribute("href", `/post/${postMock._id}/details`);
        expect(screen.getByTestId("post-link")).toHaveTextContent(`Posted on ${postMock.postedOn}`);
    });

});