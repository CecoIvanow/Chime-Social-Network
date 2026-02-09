import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AddFriendButton from "./AddFriendButton";
import userEvent from "@testing-library/user-event";

vi.mock("../../../../../../ui/buttons/button/Button", () => ({
    default: ({ onClickHandler, buttonName }) => (
        <button
            onClick={onClickHandler}
        >
            {buttonName}
        </button>
    )
}));

const mockProps = {
    handleUnfriendClick: vi.fn(),
    handleAddFriendClick: vi.fn(),
}

function setup(options = {
    isAddedAsFriend: false
}) {
    render(
        <AddFriendButton
            isAddedAsFriend={options.isAddedAsFriend}
            {...mockProps}
        />
    );
};

describe("AddFriendButton component", () => {
    it.each([
        {name: "renders Add button when user is not added as friend", isAddedAsFriend: false},
        {name: "renders Unfriend button when user is added as friend", isAddedAsFriend: true},
    ])("$name", ({ isAddedAsFriend }) => {
        setup({
            isAddedAsFriend
        });

        if (isAddedAsFriend) {
            expect(screen.getByRole("button", { name: "Unfriend"})).toBeInTheDocument();
        } else {
            expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
        };
    });

    it.each([
        { name: "Add button triggers an event when clicked", isAddedAsFriend: false},
        { name: "Unfriend button triggers an event when clicked", isAddedAsFriend: true},
    ])("$name", async ({ isAddedAsFriend }) => {
        const user = userEvent.setup();
        setup({
            isAddedAsFriend
        });

        await user.click(screen.getByRole("button"));

        if(isAddedAsFriend) {
            expect(mockProps.handleUnfriendClick).toHaveBeenCalled();
        }else{
            expect(mockProps.handleAddFriendClick).toHaveBeenCalled();
        };
    });
});