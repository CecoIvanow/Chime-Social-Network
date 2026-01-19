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

vi.mock("./users-list/PostsList", () => ({
    default: ({ matchingUsers }) => <div data-testid="users-list">
        {matchingUsers.map(user => (
            <div key={user._id} data-testid="user">{user.firstName} {user.lastName}</div>
        ))}
    </div>
}));

vi.mock("../../../ui/loading-spinner/LoadingSpinner", () => ({
    default: () => <div data-testid="loading-spinner"></div>
}));

const totalPosts = [
    { firstName: "John", lastName: "Doe", _id: "userOne" },
    { firstName: "Ivan", lastName: "Petrov", _id: "userTwo" },
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
});