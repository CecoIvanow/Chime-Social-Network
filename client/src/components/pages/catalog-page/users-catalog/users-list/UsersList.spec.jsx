import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../../../contexts/alert-context";
import { UserContext } from "../../../../../contexts/user-context";

import UsersList from "./UsersList";

vi.mock("./user-item/UserItem", () => ({
    default: ({ user, handleAddFriend, handleRemoveFriend }) => <>
        <button onClick={() => handleAddFriend(user)}>Add</button>
        <button onClick={() => handleRemoveFriend(user)}>Remove</button>
    </>
}));

vi.mock("../../../../../hooks/useUserServices", () => ({
    default: () => ({ ...useUserServicesMock }),
}));

const ERR_MSG = {
    ADD_FRIEND: "Rejected addFriend call",
    REMOVE_FRIEND: "Rejected removeFriend call",
};

const isUser = "userId236";

const mockProps = {
    matchingUsers: [
        { _id: "idOne" },
        { _id: "idTwo" },
    ],
}

const setAlert = vi.fn();

const useUserServicesMock = {
    addFriend: vi.fn(),
    removeFriend: vi.fn(),
    abortAll: vi.fn(),
};

function setup(options = {
    addFriendCallSuccess: true,
    removeFriendCallSuccess: true,
}) {
    options.addFriendCallSuccess ?
        useUserServicesMock.addFriend.mockResolvedValue(true) :
        useUserServicesMock.addFriend.mockRejectedValue(new Error(ERR_MSG.ADD_FRIEND));

    options.removeFriendCallSuccess ?
        useUserServicesMock.removeFriend.mockResolvedValue(true) :
        useUserServicesMock.removeFriend.mockRejectedValue(new Error(ERR_MSG.REMOVE_FRIEND));

    return render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <UsersList {...mockProps} />
            </UserContext.Provider>
        </AlertContext.Provider>
    );
};

describe("UsersList component", () => {
    it("renders users items based on number of users present", () => {
        setup();

        expect(screen.getAllByRole("button", { name: "Add" })).toHaveLength(mockProps.matchingUsers.length);
        expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(mockProps.matchingUsers.length);
    });

    it("triggers add friend logic on Add button click", async () => {
        const user = userEvent.setup();
        setup();

        const addFriendEls = screen.getAllByRole("button", { name: "Add" });

        for (let i = 0; i < addFriendEls.length; i++) {
            await user.click(addFriendEls[i]);

            await waitFor(() => {
                expect(useUserServicesMock.addFriend).toHaveBeenCalledWith(isUser, mockProps.matchingUsers[i]._id);
            });
        };
    });

    it("shows error message on a failed add friend call", async () => {
        const user = userEvent.setup();
        setup({
            addFriendCallSuccess: false,
            removeFriendCallSuccess: true,
        });

        const addFriendEls = screen.getAllByRole("button", { name: "Add" });

        await user.click(addFriendEls[0]);

        await waitFor(() => expect(setAlert).toHaveBeenCalledWith(ERR_MSG.ADD_FRIEND));
    });

    it("triggers remove friend logic on Remove button click", async () => {
        const user = userEvent.setup();
        setup();

        const removeFriendEls = screen.getAllByRole("button", { name: "Remove" });

        for (let i = 0; i < removeFriendEls.length; i++) {
            await user.click(removeFriendEls[i]);

            await waitFor(() => {
                expect(useUserServicesMock.removeFriend).toHaveBeenCalledWith(isUser, mockProps.matchingUsers[i]._id);
            });
        };
    });

    it("shows error message on a failed remove friend call", async () => {
        const user = userEvent.setup();
        setup({
            addFriendCallSuccess: true,
            removeFriendCallSuccess: false,
        });

        const removeFriendEls = screen.getAllByRole("button", { name: "Remove" });

        await user.click(removeFriendEls[0]);

        await waitFor(() => expect(setAlert).toHaveBeenCalledWith(ERR_MSG.REMOVE_FRIEND));
    });

    it("stops all ongoing calls on component unmount", () => {
        const { unmount } = setup();

        unmount();

        expect(useUserServicesMock.abortAll).toHaveBeenCalled();
    })
});