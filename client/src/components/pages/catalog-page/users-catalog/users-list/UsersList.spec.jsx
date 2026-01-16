import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { UserContext } from "../../../../../contexts/user-context";
import { AlertContext } from "../../../../../contexts/alert-context";

import UsersList from "./UsersList";

vi.mock("./user-item/UserItem", () => ({
    default: ({ user, handleAddFriend, handleRemoveFriend }) => <>
        <button data-testid="add-friend" onClick={() => handleAddFriend(user)}></button>
        <button data-testid="remove-friend" onClick={() => handleRemoveFriend(user)}></button>
    </>
}));

vi.mock("../../../../../hooks/useUserServices", () => ({
    default: () => ({
        addFriend: addFriendMock,
        removeFriend: removeFriendMock,
        abortAll: abortAllMock,
    })
}))
const ERR_MSG = {
    ADD_FRIEND: "Successfully rejcted addFriend call",
    REMOVE_FRIEND: "Successfully rejected removeFriend call",
}


const isUser = "userId236";

const setAlert = vi.fn();

const matchingUsers = [
    { _id: "idOne" },
    { _id: "idTwo" },
];

const addFriendMock = vi.fn();
const removeFriendMock = vi.fn();
const abortAllMock = vi.fn();

function setup(options = {
    addFriendCallSuccess: true,
    removeFriendCallSuccess: true,
}) {
    options.addFriendCallSuccess ?
        addFriendMock.mockResolvedValue(true) :
        addFriendMock.mockRejectedValue(new Error(ERR_MSG.ADD_FRIEND));

    options.removeFriendCallSuccess ?
        removeFriendMock.mockResolvedValue(true) :
        removeFriendMock.mockRejectedValue(new Error(ERR_MSG.ADD_FRIEND));

    render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <UsersList matchingUsers={matchingUsers} />
            </UserContext.Provider>
        </AlertContext.Provider>
    );
}

describe("UsersList component", () => {
    it("renders inner UserItem component correct number of times", () => {
        setup();

        expect(screen.getAllByTestId("add-friend")).toHaveLength(matchingUsers.length);
        expect(screen.getAllByTestId("remove-friend")).toHaveLength(matchingUsers.length);
    });

    it("triggers addFriend with passed isUser and passed user._id prop", async () => {
        setup();

        const addFriendEls = screen.getAllByTestId("add-friend");

        for (let i = 0; i < addFriendEls.length; i++) {
            fireEvent.click(addFriendEls[i]);

            await waitFor(() => {
                expect(addFriendMock).toHaveBeenCalledWith(isUser, matchingUsers[i]._id);
            });
        };
    });
});