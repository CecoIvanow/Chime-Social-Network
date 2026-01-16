import { fireEvent, prettyDOM, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { UserContext } from "../../../../../../contexts/user-context";

import UserItem from "./UserItem";

vi.mock("./user-item-details/UserItemDetails", () => ({
    default: ({ user }) => <p data-testid="user-item-details">{user.age}</p>
}));

vi.mock("./add-friend-button/AddFriendButton", () => ({
    default: ({ isAddedAsFriend, handleAddFriendClick, handleUnfriendClick }) => <>
        {isAddedAsFriend ? (
            <button data-testid="add-friend-button" onClick={handleAddFriendClick}></button>
        ) : (
            <button data-testid="unfriend-button" onClick={handleUnfriendClick}></button>
        )}
    </>
}));

const isUser = "userId111";

const user = {
    _id: "userId123",
    friends: ["userId4234"],
    age: "28",
};

const handleAddFriendMock = vi.fn();
const handleRemoveFriend = vi.fn();

function setup(options = {
    isAddedAsFriend: false
}) {
    const userWithFriends = {
        ...user,
        friends: options.isAddedAsFriend ? [...user.friends, isUser] : [...user.friends]
    };

    render(
        <UserContext.Provider value={{ isUser }}>
            <UserItem
                handleAddFriend={handleAddFriendMock}
                handleRemoveFriend={handleRemoveFriend}
                user={userWithFriends}
            />
        </UserContext.Provider>
    );
};

describe("UserItem component", () => {
    it("renders UserItenDeails with passed props", () => {
        setup();

        expect(screen.getByTestId("user-item-details")).toHaveTextContent(user.age);
    });
});