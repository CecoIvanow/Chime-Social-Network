import { useParams } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../../../contexts/user-context.js";

import PostsSection from "./PostsSection.jsx";

vi.mock("../../../ui/headings/SectionHeading", () => ({
    default: ({ sectionName }) => <h3>{sectionName}</h3>
}));

vi.mock("../post-create-form/PostCreateForm", () => ({
    default: () => <form data-testid="post-form"></form>
}));

vi.mock("../../../ui/loading-spinner/LoadingSpinner", () => ({
    default: () => <div data-testid="loading-spinner"></div>
}));

vi.mock("../posts-list/PostsList", () => ({
    default: () => <div data-testid="posts-list"></div>
}));

vi.mock("react-router", () => ({
    useParams: vi.fn(),
}));

const isUser = "loggedInUserId";
const userId = "profileUserId";

const mockProps = {
    userName: "John",
};

function setup(options = {
    userId: null,
    isLoading: false,
}) {
    useParams.mockReturnValue({ userId: options.userId })

    render(
        <UserContext.Provider value={{ isUser }}>
            <PostsSection
                isLoading={options.isLoading}
                {...mockProps}
            />
        </UserContext.Provider>
    );
}

describe("PostsSection component", () => {
    it.each([
        { name: "renders SectionHeading with Friends Posts: text content on invalid userProfileId", result: "Friends Posts:", userId: null },
        { name: `renders SectionHeading with ${mockProps.userName}'s Posts: text content on not matching userProfileId and userId`, result: `${mockProps.userName}'s Posts:`, userId, },
        { name: `renders SectionHeading with My Posts: text content on matching userProfileId and userId`, result: "My Posts:", userId: isUser },
    ])("$name", ({ result, userId }) => {
        setup({
            userId,
            isLoading: false,
        });

        expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(result);
    })

    it.each([
        { name: "renders PostCreateForm on matching isUser and userId", userId: isUser },
        { name: "does not render PostCreateForm on not matching isUser and userId", userId, },
    ])("$name", ({ userId }) => {
        setup({
            userId,
            isLoading: false,
        });

        if (isUser === userId) {
            expect(screen.getByTestId("post-form")).toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("post-form")).not.toBeInTheDocument();
        }
    })

    it.each([
        { name: "renders LoadingSpinner when component is still loading", isLoading: true },
        { name: "renders PostsList when component is not loading", isLoading: false },
    ])("$name", ({ isLoading }) => {
        setup({
            userId,
            isLoading,
        });

        if (isLoading) {
            expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
            expect(screen.queryByTestId("posts-list")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("posts-list")).toBeInTheDocument();
            expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
        }
    })
});