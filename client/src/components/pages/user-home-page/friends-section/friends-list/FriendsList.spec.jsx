import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import FriendsList from "./FriendsList";

vi.mock("./friend-item/FriendItem", () => ({
    default: ({ friend }) => <div data-testid="friend-item">{friend}</div>
}));

const mockProps = {
    matchingFriends: [
        "friend1",
        "friend2"
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
    it("renders the correct number of FriendItem components", () => {
        expect(screen.getAllByTestId("friend-item")).toHaveLength(mockProps.matchingFriends.length);
    });

    it("renders FriendItem with passed props", () => {
        expect(screen.getAllByTestId("friend-item").at(0)).toHaveTextContent(mockProps.matchingFriends[0]);
    });
});