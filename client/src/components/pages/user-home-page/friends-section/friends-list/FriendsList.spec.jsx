import { fireEvent, getAllByTestId, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FriendsList from "./FriendsList";

vi.mock("./friend-item/FriendItem", () => ({
    default: ({ friend }) => <div data-testid="friend-item">{friend}</div>
}))

describe("FriendsList component", () => {
    const matchingFriends = ["friend1", "friend2"];

    it("renders the correct number of FriendItem components", () => {
        render(
            <FriendsList
                matchingFriends={matchingFriends}
            />
        );

        expect(screen.getAllByTestId("friend-item")).toHaveLength(matchingFriends.length);
    });

    it("renders FriendItem with passed props", () => {
        render(
            <FriendsList
                matchingFriends={matchingFriends}
            />
        );

        expect(screen.getAllByTestId("friend-item").at(0)).toHaveTextContent(matchingFriends[0]);
    });
});