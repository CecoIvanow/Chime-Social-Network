import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { UserContext } from "../../../../../../contexts/user-context";

import UserItem from "./UserItem";

vi.mock("./user-item-details/UserItemDetails", () => ({
    default: ({ user }) => <p data-testid="user-item-details">{user.age}</p>
}));

vi.mock("./add-friend-button/AddFriendButton", () => ({
    default: ({ isAddedAsFriend, handleAddFriendClick, handleUnfriendClick }) => <div data-testid="add-friend-button-comp">
        {isAddedAsFriend ? (
            <button data-testid="unfriend" onClick={handleUnfriendClick}></button>
        ) : (
            <button data-testid="add-friend" onClick={handleAddFriendClick}></button>
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
const handleRemoveFriendMock = vi.fn();

function setup(options = {
    isAddedAsFriend: false,
    isUserValue: isUser,
    handleAddFriendReturn: true,
    handleRemoveFriendReturn: true,
}) {
    const userWithFriends = {
        ...user,
        friends: options.isAddedAsFriend ? [...user.friends, isUser] : [...user.friends]
    };

    options.handleAddFriendReturn ?
        handleAddFriendMock.mockResolvedValue(true) :
        handleAddFriendMock.mockResolvedValue("");

    options.handleRemoveFriendReturn ?
        handleRemoveFriendMock.mockResolvedValue(true) :
        handleRemoveFriendMock.mockResolvedValue("");

    render(
        <UserContext.Provider value={{ isUser: options.isUserValue }}>
            <UserItem
                handleAddFriend={handleAddFriendMock}
                handleRemoveFriend={handleRemoveFriendMock}
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
            handleAddFriendReturn: true,
            handleRemoveFriendReturn: true,
        });

        if (shouldRender) {
            expect(screen.getByTestId("add-friend-button-comp")).toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("add-friend-button-comp")).not.toBeInTheDocument();
        }
    });

    it.each([
        { name: "passes props and renders add-friend button inside AddFriendButton on isAddedAsFriend true", isAddedAsFriend: true },
        { name: "passes props and renders unfriend button inside AddFriendButton on isAddedAsFriend false", isAddedAsFriend: false },
    ])("$name", ({ isAddedAsFriend }) => {
        setup({
            isAddedAsFriend,
            isUserValue: isUser,
            handleAddFriendReturn: true,
            handleRemoveFriendReturn: true,
        });

        if (isAddedAsFriend) {
            expect(screen.queryByTestId("add-friend")).not.toBeInTheDocument();
            expect(screen.getByTestId("unfriend")).toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("unfriend")).not.toBeInTheDocument();
            expect(screen.getByTestId("add-friend")).toBeInTheDocument();
        }
    });

    it("triggers handleAddFriend and changes setIsAddedAsFriend to true on successfull call", async () => {
        setup();

        fireEvent.click(screen.getByTestId("add-friend"));

        await waitFor(() => {
            expect(handleAddFriendMock).toHaveBeenCalledWith(user);
        });

        expect(screen.queryByTestId("add-friend")).not.toBeInTheDocument();
        expect(screen.getByTestId("unfriend")).toBeInTheDocument();
    });

    it("triggers handleAddFriend and does not change setIsAddedAsFriend on empty call", async () => {
        setup({
            isAddedAsFriend: false,
            isUserValue: isUser,
            handleAddFriendReturn: false,
            handleRemoveFriendReturn: true,
        });

        fireEvent.click(screen.getByTestId("add-friend"));

        await waitFor(() => {
            expect(handleAddFriendMock).toHaveBeenCalledWith(user);
        });

        expect(screen.getByTestId("add-friend")).toBeInTheDocument();
        expect(screen.queryByTestId("unfriend")).not.toBeInTheDocument();
    });

    it("triggers handleRemoveFriend and changes setIsAddedAsFriend to false on successfull call", async () => {
        setup({
            isAddedAsFriend: true,
            isUserValue: isUser,
            handleAddFriendReturn: true,
            handleRemoveFriendReturn: true,
        });

        const userWithFriends = {
            ...user,
            friends: [...user.friends, isUser]
        }

        fireEvent.click(screen.getByTestId("unfriend"));

        await waitFor(() => {
            expect(handleRemoveFriendMock).toHaveBeenCalledWith(userWithFriends);
        });

        expect(screen.queryByTestId("unfriend")).not.toBeInTheDocument();
        expect(screen.getByTestId("add-friend")).toBeInTheDocument();
    });

    it("triggers handleRemoveFriend and does not change setIsAddedAsFriend on empty call", async () => {
        setup({
            isAddedAsFriend: true,
            isUserValue: isUser,
            handleAddFriendReturn: true,
            handleRemoveFriendReturn: false,
        });

        const userWithFriends = {
            ...user,
            friends: [...user.friends, isUser]
        }

        fireEvent.click(screen.getByTestId("unfriend"));

        await waitFor(() => {
            expect(handleRemoveFriendMock).toHaveBeenCalledWith(userWithFriends);
        });

        expect(screen.getByTestId("unfriend")).toBeInTheDocument();
        expect(screen.queryByTestId("add-friend")).not.toBeInTheDocument();
    });
});