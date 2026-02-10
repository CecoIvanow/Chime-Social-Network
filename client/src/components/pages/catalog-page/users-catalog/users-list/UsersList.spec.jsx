import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../../../contexts/alert-context";
import { UserContext } from "../../../../../contexts/user-context";

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
}));

const ERR_MSG = {
    ADD_FRIEND: "Rejected addFriend call",
    REMOVE_FRIEND: "Rejected removeFriend call",
};

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
        removeFriendMock.mockRejectedValue(new Error(ERR_MSG.REMOVE_FRIEND));

    const { unmount } = render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <UsersList matchingUsers={matchingUsers} />
            </UserContext.Provider>
        </AlertContext.Provider>
    );

    return { unmount };
}

describe("UsersList component", () => {
    it("renders inner UserItem component correct number of times", () => {
        setup();

        expect(screen.getAllByTestId("add-friend")).toHaveLength(matchingUsers.length);
        expect(screen.getAllByTestId("remove-friend")).toHaveLength(matchingUsers.length);
    });

    it("triggers addFriend with passed isUser and passed user._id prop", async () => {
        const user = userEvent.setup();
        setup();

        const addFriendEls = screen.getAllByTestId("add-friend");

        for (let i = 0; i < addFriendEls.length; i++) {
            await user.click(addFriendEls[i]);

            await waitFor(() => {
                expect(addFriendMock).toHaveBeenCalledWith(isUser, matchingUsers[i]._id);
            });
        };
    });

    it("triggers setAlert on rejected addFriend call", async () => {
        const user = userEvent.setup();
        setup({
            addFriendCallSuccess: false,
            removeFriendCallSuccess: true,
        });

        const addFriendEls = screen.getAllByTestId("add-friend");

        await user.click(addFriendEls[0]);

        await waitFor(() => expect(setAlert).toHaveBeenCalledWith(ERR_MSG.ADD_FRIEND));
    });

    it("triggers removeFriend with passed isUser and passed user._id prop", async () => {
        const user = userEvent.setup();
        setup();

        const removeFriendEls = screen.getAllByTestId("remove-friend");

        for (let i = 0; i < removeFriendEls.length; i++) {
            await user.click(removeFriendEls[i]);

            await waitFor(() => {
                expect(removeFriendMock).toHaveBeenCalledWith(isUser, matchingUsers[i]._id);
            });
        };
    });

    it("triggers setAlert on rejected removeFriend call", async () => {
        const user = userEvent.setup();
        setup({
            addFriendCallSuccess: true,
            removeFriendCallSuccess: false,
        });

        const removeFriendEls = screen.getAllByTestId("remove-friend");

        await user.click(removeFriendEls[0]);

        await waitFor(() => expect(setAlert).toHaveBeenCalledWith(ERR_MSG.REMOVE_FRIEND));
    });

    it("triggers setAlert on component unmount", () => {
        const { unmount } = setup();

        unmount();

        expect(abortAllMock).toHaveBeenCalled();
    })
});