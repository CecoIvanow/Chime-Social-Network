import { useParams } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../../../contexts/user-context.js";

import PostsSection from "./PostsSection.jsx";

vi.mock("../../../ui/headings/SectionHeading", () => ({
    default: ({ sectionName }) => <div data-testid="section-heading">{sectionName}</div>
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
    useParams: vi.fn()
}));

const mockProps = {
    userName: 'John',
}

describe("PostsSection component", () => {
    it.each([
        { expected: 'Friends Posts:', difference: 'invalid', isUser: '123', userId: null, target: 'userId' },
        { expected: `${mockProps.userName}'s Posts:`, difference: 'differing', isUser: '123', userId: '222', target: 'isUser and userId' },
        { expected: 'My Posts:', difference: 'matching', isUser: '123', userId: '123', target: 'isUser and userId' },
    ])('renders SectionHeading with $expected text content on $difference $target', ({ expected, isUser, userId }) => {
        useParams.mockReturnValue({ userId });

        render(
            <UserContext.Provider value={{ isUser }}>
                <PostsSection
                    isLoading={false}
                    userName={mockProps.userName}
                />
            </UserContext.Provider>
        );

        expect(screen.getByTestId('section-heading')).toHaveTextContent(expected);
    })

    it.each([
        { action: 'renders', difference: 'matching', isUser: '123', userId: '123' },
        { action: 'does not render', difference: 'differing', isUser: null, userId: '0' },
    ])("$action PostCreateForm on $difference isUser and userId", ({ isUser, userId }) => {
        useParams.mockReturnValue({ userId });

        render(
            <UserContext.Provider value={{ isUser }}>
                <PostsSection
                    isLoading={false}
                    userName={mockProps.userName}
                />
            </UserContext.Provider>
        );

        if (isUser === userId) {
            expect(screen.getByTestId("post-form")).toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("post-form")).not.toBeInTheDocument();
        }
    })

    it.each([
        { toRender: 'PostsList', isLoadingStatus: false },
        { toRender: 'LoadingSpinner', isLoadingStatus: true },
    ])("renders $toRender component on isloading $isLoadingStatus", ({ isLoadingStatus }) => {
        useParams.mockReturnValue({ userId: '123' });

        render(
            <UserContext.Provider value={{ isUser: '123' }}>
                <PostsSection
                    isLoading={isLoadingStatus}
                    userName={mockProps.userName}
                />
            </UserContext.Provider>
        );

        if (isLoadingStatus) {
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
            expect(screen.queryByTestId('posts-list')).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId('posts-list')).toBeInTheDocument();
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        }
    })
});