import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../../../../../contexts/user-context";

import UserItem from "./UserItem";

vi.mock("./user-item-details/UserItemDetails", () => ({
    default: ({ user }) => <p data-testid="user-item-details">{user.age}</p>
}));

vi.mock("./add-friend-button/AddFriendButton", () => ({
    default: ({ isAddedAsFriend, handleAddFriendClick, handleUnfriendClick }) => (
        <div data-testid="add-friend-button-comp">
            {isAddedAsFriend ? (
                <button onClick={handleUnfriendClick}>Unfriend</button>
            ) : (
                <button onClick={handleAddFriendClick}>Add</button>
            )}
        </div>
    ),
}));

const isUser = "userId111";

const mockProps = {
    user: {
        _id: "userId123",
        friends: ["userId4234"],
        age: "28",
    },
    handleAddFriend: vi.fn(),
    handleRemoveFriend: vi.fn(),
};

function setup(options = {
    isAddedAsFriend: false,
    isUserValue: isUser,
    handleAddFriendReturn: true,
    handleRemoveFriendReturn: true,
}) {
    const userWithFriends = {
        ...mockProps,
        user: {
            ...mockProps.user,
            friends: options.isAddedAsFriend ? [...mockProps.user.friends, isUser] : [...mockProps.user.friends],
        },
    };

    options.handleAddFriendReturn ?
        mockProps.handleAddFriend.mockResolvedValue(true) :
        mockProps.handleAddFriend.mockResolvedValue("");

    options.handleRemoveFriendReturn ?
        mockProps.handleRemoveFriend.mockResolvedValue(true) :
        mockProps.handleRemoveFriend.mockResolvedValue("");

    render(
        <UserContext.Provider value={{ isUser: options.isUserValue }}>
            <UserItem
                {...userWithFriends}
            />
        </UserContext.Provider>
    );
};

describe("UserItem component", () => {
    it("renders with user details", () => {
        setup();

        expect(screen.getByTestId("user-item-details")).toHaveTextContent(mockProps.user.age);
    });

    it.each([
        { name: "renders friend buttons when user is logged in and is not viewing their profile", isUserValue: isUser, shouldRender: true },
        { name: "does not render friend buttons when user is logged in and is viewing their profile", isUserValue: mockProps.user._id, shouldRender: false },
        { name: "does not render friend buttons when user is not logged in", isUserValue: "", shouldRender: false },
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
        { name: "renders Add friend button when the users are not added as friends", isAddedAsFriend: true },
        { name: "renders Unfriend button when the users are added as friends", isAddedAsFriend: false },
    ])("$name", ({ isAddedAsFriend }) => {
        setup({
            isAddedAsFriend,
            isUserValue: isUser,
            handleAddFriendReturn: true,
            handleRemoveFriendReturn: true,
        });

        if (isAddedAsFriend) {
            expect(screen.queryByRole("button", { name: "Add" })).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Unfriend" })).toBeInTheDocument();
        } else {
            expect(screen.queryByRole("button", { name: "Unfriend" })).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
        }
    });

    it("adds users as friends when the Add button is clicked", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Add" }));

        await waitFor(() => {
            expect(mockProps.handleAddFriend).toHaveBeenCalledWith(mockProps.user);
        });

        expect(screen.queryByRole("button", { name: "Add" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Unfriend" })).toBeInTheDocument();
    });

    it("does not add users as friends on a failed add friend call", async () => {
        const user = userEvent.setup();
        setup({
            isAddedAsFriend: false,
            isUserValue: isUser,
            handleAddFriendReturn: false,
            handleRemoveFriendReturn: true,
        });

        await user.click(screen.getByRole("button", { name: "Add" }));

        await waitFor(() => {
            expect(mockProps.handleAddFriend).toHaveBeenCalledWith(mockProps.user);
        });

        expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Unfriend" })).not.toBeInTheDocument();
    });

    it("removes users as friends when the Unfriend button is clicked", async () => {
        const user = userEvent.setup();
        setup({
            isAddedAsFriend: true,
            isUserValue: isUser,
            handleAddFriendReturn: true,
            handleRemoveFriendReturn: true,
        });

        const userWithFriends = {
            ...mockProps.user,
            friends: [...mockProps.user.friends, isUser]
        }

        await user.click(screen.getByRole("button", { name: "Unfriend" }));

        await waitFor(() => {
            expect(mockProps.handleRemoveFriend).toHaveBeenCalledWith(userWithFriends);
        });

        expect(screen.queryByRole("button", { name: "Unfriend" })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    });

    it("does not remove users as friends on a failed unfriend call", async () => {
        const user = userEvent.setup();
        setup({
            isAddedAsFriend: true,
            isUserValue: isUser,
            handleAddFriendReturn: true,
            handleRemoveFriendReturn: false,
        });

        const userWithFriends = {
            ...mockProps.user,
            friends: [...mockProps.user.friends, isUser]
        }

        await user.click(screen.getByRole("button", { name: "Unfriend" }));

        await waitFor(() => {
            expect(mockProps.handleRemoveFriend).toHaveBeenCalledWith(userWithFriends);
        });

        expect(screen.getByRole("button", { name: "Unfriend" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Add" })).not.toBeInTheDocument();
    });
});