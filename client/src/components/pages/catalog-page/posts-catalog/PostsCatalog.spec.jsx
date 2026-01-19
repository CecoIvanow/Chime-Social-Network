import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { TotalPostsContext } from "../../../../contexts/total-posts-context";

import PostsCatalog from "./PostsCatalog";

vi.mock("../../../ui/headings/SectionHeading", () => ({
    default: ({ sectionName }) => <p data-testid="section-heading">{sectionName}</p>
}));

vi.mock("../../../ui/search-field/SearchField", () => ({
    default: ({ searchBy, setSearchParams }) => <>
        <label data-testid="search-field-label">{searchBy}</label>
        <input
            data-testid="search-field-input"
            type="text"
            onChange={(e) => setSearchParams(e.currentTarget.value)}
        />
    </>
}));

vi.mock("../../../shared/post/posts-list/PostsList", () => ({
    default: () =>
        <TotalPostsContext.Consumer>
            {ctx => (
                <div data-testid="posts-list" onClick={ctx.setTotalPosts}>
                    {ctx.totalPosts.map(post => (
                        <div
                            key={post._id}
                            data-testid="post"
                        >
                            {post.content}
                        </div>)
                    )}
                </div>
            )}
        </TotalPostsContext.Consumer>
}));

vi.mock("../../../ui/loading-spinner/LoadingSpinner", () => ({
    default: () => <div data-testid="loading-spinner"></div>
}));

const totalPosts = [
    { _id: "postOne", content: "First post!" },
    { _id: "postTwo", content: "Second post!" },
];

const setTotalPostsMock = vi.fn();

function setup(options = {
    isLoading: true
}) {
    render(
        <PostsCatalog
            isLoading={options.isLoading}
            totalPosts={totalPosts}
            setTotalPosts={setTotalPostsMock}
        />
    );
};

describe("PostsCatalog component", () => {
    it("renders component with passed props", () => {
        setup();

        expect(screen.getByTestId("section-heading")).toHaveTextContent("All Posts:");

        expect(screen.getByTestId("search-field-label")).toHaveTextContent("content");
        expect(screen.getByTestId("search-field-input")).toBeInTheDocument();
    });

    it.each([
        { name: "renders LoadingSpinner on isLoading true", isLoading: true },
        { name: "renders PostsList on isLoading false", isLoading: false },
    ])("$name", ({ isLoading }) => {
        setup({
            isLoading,
        });

        if (isLoading) {
            expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
            expect(screen.queryByTestId("posts-list")).not.toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
            expect(screen.getByTestId("posts-list")).toBeInTheDocument();
        }
    });
});