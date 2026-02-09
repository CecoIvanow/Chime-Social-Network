import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
                            {post.text}
                        </div>)
                    )}
                </div>
            )}
        </TotalPostsContext.Consumer>
}));

vi.mock("../../../ui/loading-spinner/LoadingSpinner", () => ({
    default: () => <div data-testid="loading-spinner"></div>
}));

const mockProps = {
    setTotalPosts: vi.fn(),
    totalPosts: [
        { _id: "postOne", text: "First post!" },
        { _id: "postTwo", text: "Second post!" },
    ],
};

function setup(options = {
    isLoading: true
}) {
    render(
        <PostsCatalog
            {...mockProps}
            isLoading={options.isLoading}
        />
    );
};

describe("PostsCatalog component", () => {
    it("renders SectionHeading and SearchField child components with sectionName and searchBy props ", () => {
        setup();

        expect(screen.getByTestId("section-heading")).toHaveTextContent("All Posts:");

        expect(screen.getByTestId("search-field-label")).toHaveTextContent("content");
        expect(screen.getByTestId("search-field-input")).toBeInTheDocument();
    });

    it.each([
        { name: "renders load spinner while PostsList is loading data", isLoading: true },
        { name: "renders PostsList after data has been loaded", isLoading: false },
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

    it.each([
        { name: "matches only the first post", searchBy: "First", expectedCount: 1 },
        { name: "matches only the second post", searchBy: "Second", expectedCount: 1 },
        { name: "matches all posts with an empty string", searchBy: "", expectedCount: 2 },
        { name: "matches all posts with 'post' string", searchBy: "post", expectedCount: 2 },
        { name: "does not match posts with invalid string", searchBy: "Invalid!", expectedCount: "0" },
    ])("$name", async ({ searchBy, expectedCount }) => {
        const user = userEvent.setup();
        setup({
            isLoading: false,
        });

        if (searchBy) {
            await user.type(screen.getByTestId("search-field-input"), searchBy);
        };

        if (expectedCount > 0) {
            expect(await screen.findAllByTestId("post")).toHaveLength(expectedCount);
        } else {
            expect(screen.queryAllByTestId("post")).toHaveLength(Number(expectedCount));
        };
    });

    it("correctly passes posts to PostsList", async () => {
        const user = userEvent.setup();
        setup({
            isLoading: false
        });

        await user.click(screen.getByTestId("posts-list"));

        expect(mockProps.setTotalPosts).toHaveBeenCalled();
    });
});