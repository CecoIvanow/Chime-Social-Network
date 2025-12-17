import { getByTestId, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FriendsSection from "./FriendsSection";

vi.mock("../../../ui/search-field/SearchField", () => ({
    default: ({ setSearchParams, searchBy }) =>
        <input
            type="text"
            data-testid="search-field"
            placeholder={searchBy}
            onChange={setSearchParams}
        />
}));

vi.mock("../../../ui/headings/SectionHeading", () => ({
    default: ({ sectionName }) => <div data-testid="section-heading">{sectionName}</div>
}));

vi.mock("./friends-list/FriendsList", () => ({
    default: ({ matchingFriends }) =>
        matchingFriends.map(friendName =>
            <div
                data-testid="friends-list"
                key={friendName._id}
            >
            </div>
        )
}));

vi.mock("../../../ui/loading-spinner/LoadingSpinner", () => ({
    default: () => <div data-testid="spinner"></div>
}));

describe("FriendsSection component", () => {
    const userFriends = [
        { firstName: "Ivan", lastName: "Ivanov" },
        { firstName: "Peter", lastName: "Petrov" },
    ];

    const isLoading = false;

    const setFriendSearchParams = vi.fn();
    const setMatchingFriends = vi.fn();

    it.each([
        { isLoading: true, renderedComp: "LoadingSpinner" },
        { isLoading: false, renderedComp: "FriendsList" },
    ])("passes props and renders $renderedComp on isLoading $isLoading", ({ isLoading }) => {
        render(
            <FriendsSection
                isLoading={isLoading}
                userFriends={userFriends}
            />
        );

        if(isLoading){
            expect(screen.getByTestId("spinner")).toBeInTheDocument();
            expect(screen.queryAllByTestId("friends-list")).toHaveLength(0);
        } else {
            expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
            expect(screen.getAllByTestId("friends-list")).toHaveLength(userFriends.length);
        }
    });

    it("renders sectionHeading with correct friends amount", () => {
        render(
            <FriendsSection
                isLoading={isLoading}
                userFriends={userFriends}
            />
        );

        expect(screen.getByTestId("section-heading")).toHaveTextContent(`Friends (${userFriends.length}):`)
    });
});