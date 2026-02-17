import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FriendsSection from "./FriendsSection";

vi.mock("../../../ui/headings/SectionHeading", () => ({
    default: ({ sectionName }) => <div data-testid="section-heading">{sectionName}</div>
}));

vi.mock("../../../ui/search-field/SearchField", () => ({
    default: ({ setSearchParams, searchBy }) => <>
        <label data-testid="search-field-label">{searchBy}</label>
        <input
            data-testid="search-field-input"
            type="text"
            onChange={(e) => setSearchParams(e.currentTarget.value)}
        />
    </>
}));

vi.mock("../../../ui/loading-spinner/LoadingSpinner", () => ({
    default: () => <div data-testid="spinner"></div>
}));

vi.mock("./friends-list/FriendsList", () => ({
    default: ({ matchingFriends }) =>
        matchingFriends.map(friendName =>
            <div
                data-testid="friends-list"
                key={friendName.firstName}
            >
            </div>
        )
}));

const mockProps = {
    userFriends: [
        { firstName: "Ivan", lastName: "Ivanov" },
        { firstName: "Peter", lastName: "Petrov" },
    ],
};

function setup(options = {
    isLoading: false,
}) {
    render(
        <FriendsSection
            isLoading={options.isLoading}
            {...mockProps}
        />
    );
};

describe("FriendsSection component", () => {
    it.each([
        { name: "renders loading spinner while friends data is loading", isLoading: true },
        { name: "renders friends after data has been loaded", isLoading: false },
    ])("$name", ({ isLoading }) => {
        setup({
            isLoading,
        });

        if (isLoading) {
            expect(screen.queryAllByTestId("friends-list")).toHaveLength(0);
            expect(screen.getByTestId("spinner")).toBeInTheDocument();
        } else {
            expect(screen.getAllByTestId("friends-list")).toHaveLength(mockProps.userFriends.length);
            expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
        }
    });

    it("renders friends section heading with correct content", () => {
        setup();

        expect(screen.getByText(`Friends (${mockProps.userFriends.length}):`)).toBeInTheDocument();
    });

    it("renders search field with correct search by content", () => {
        setup();

        expect(screen.getByTestId("search-field-label")).toHaveTextContent("name");
    });

    it.each([
        { name: "matches the only 'Ivan' friend", searchBy: "Ivan", expectedCount: 1 },
        { name: "matches the only 'Petrov' friend", searchBy: "Petrov", expectedCount: 1 },
        { name: "matches all people with an empty search string", searchBy: "", expectedCount: mockProps.userFriends.length },
        { name: "matches everyone using search string 'ov' in their names", searchBy: "ov", expectedCount: mockProps.userFriends.length },
        { name: "matches no one on when searching with 'William'", searchBy: "William", expectedCount: "0" },
    ])("$name", async ({ searchBy, expectedCount }) => {
        const user = userEvent.setup();
        setup({
            isLoading: false,
        });

        if (searchBy) {
            await user.type(screen.getByTestId("search-field-input"), searchBy);
        };

        if (expectedCount > 0) {
            expect(await screen.findAllByTestId("friends-list")).toHaveLength(expectedCount);
        } else {
            expect(screen.queryAllByTestId("friends-list")).toHaveLength(Number(expectedCount));
        };
    });

    it("uses an empty array as default when userFriends prop is not provided", () => {
        render(
            <FriendsSection
                isLoading={false}
            />
        );

        expect(screen.queryAllByTestId("friends-list")).toHaveLength(0);
    });
});