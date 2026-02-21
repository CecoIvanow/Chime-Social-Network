import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../../../contexts/user-context.js";

import PostsSection from "./PostsSection.jsx";

vi.mock("react-router", () => ({
    useParams: () => reactRouterMock.useParams(),
}));

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

const isUser = "loggedInUserId";
const userId = "profileUserId";

const reactRouterMock = {
    useParams: vi.fn(),
};

const mockProps = {
    userName: "John",
};

function setup(options = {
    userId: null,
    isLoading: false,
}) {
    reactRouterMock.useParams.mockReturnValue({ userId: options.userId });

    render(
        <UserContext.Provider value={{ isUser }}>
            <PostsSection
                isLoading={options.isLoading}
                {...mockProps}
            />
        </UserContext.Provider>
    );
};

describe("PostsSection component", () => {
    it.each([
        { name: "renders the section with 'Friends Posts:' text content when not in a user profile", result: "Friends Posts:", userId: null },
        { name: `renders the section with '${mockProps.userName}'s Posts:' text content when the user is logged in and in another user's profile`, result: `${mockProps.userName}'s Posts:`, userId, },
        { name: `renders the section with 'My Posts:' text content when the user is logged in and in their profile`, result: "My Posts:", userId: isUser },
    ])("$name", ({ result, userId }) => {
        setup({
            userId,
            isLoading: false,
        });

        expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(result);
    });

    it.each([
        { name: "renders the post creation form on when the user is logged in and is in their profile", userId: isUser },
        { name: "does not render the post creation form on when the user is either not logged in or is but not in their profile", userId, },
    ])("$name", ({ userId }) => {
        setup({
            userId,
            isLoading: false,
        });

        if (isUser === userId) {
            expect(screen.getByTestId("post-form")).toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("post-form")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders a loading spinner instead of posts while data is still loading", isLoading: true },
        { name: "renders posts instead of a loading spinner after data has loaded", isLoading: false },
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
        };
    });
});