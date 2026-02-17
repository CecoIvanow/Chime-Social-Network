import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import FriendsList from "./FriendsList";

vi.mock("./friend-item/FriendItem", () => ({
    default: ({ friend }) => <div data-testid="friend-item">{friend.name}</div>
}));

const mockProps = {
    matchingFriends: [
        {name: "friend1", _id: 1},
        {name: "friend2", _id: 2},
    ]
};

beforeEach(() => {
    render(
        <FriendsList
            {...mockProps}
        />
    );
});

describe("FriendsList component", () => {
    it("renders the correct number of friends", () => {
        expect(screen.getAllByTestId("friend-item")).toHaveLength(mockProps.matchingFriends.length);
    });

    it("renders friends with the correct data", () => {
        expect(screen.getAllByTestId("friend-item").at(0)).toHaveTextContent(mockProps.matchingFriends.at(0).name);
    });
});