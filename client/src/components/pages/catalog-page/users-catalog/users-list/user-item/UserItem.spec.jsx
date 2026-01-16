import { fireEvent, prettyDOM, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { UserContext } from "../../../../../../contexts/user-context";

import UserItem from "./UserItem";

vi.mock("./user-item-details/UserItemDetails", () => ({
    default: ({ user }) => <p data-testid="user-item-details">{user.age}</p>
}));

vi.mock("./add-friend-button/AddFriendButton", () => ({
    default: ({ isAddedAsFriend, handleAddFriendClick, handleUnfriendClick }) => <div data-testid="add-friend-button-comp">
        {isAddedAsFriend ? (
            <button data-testid="add-friend" onClick={handleAddFriendClick}></button>
        ) : (
            <button data-testid="unfriend" onClick={handleUnfriendClick}></button>
        )}
    </div>
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
    isAddedAsFriend: false,
    isUserValue: isUser,
}) {
    const userWithFriends = {
        ...user,
        friends: options.isAddedAsFriend ? [...user.friends, isUser] : [...user.friends]
    };

    render(
        <UserContext.Provider value={{ isUser: options.isUserValue }}>
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

    it.each([
        { name: "renders AddFriendButton when isUser exists and is different from user._id", isUserValue: isUser, shouldRender: true },
        { name: "does not render AddFriendButton when isUser exists and matches user._id", isUserValue: user._id, shouldRender: false },
        { name: "does not render AddFriendButton when isUser is empty", isUserValue: "", shouldRender: false },
    ])("$name", ({ isUserValue, shouldRender }) => {
        setup({
            isAddedAsFriend: false,
            isUserValue,
        });

        if (shouldRender) {
            expect(screen.getByTestId("add-friend-button-comp")).toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("add-friend-button-comp")).not.toBeInTheDocument();
        }
    });
});