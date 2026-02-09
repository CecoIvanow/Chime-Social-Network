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

    it("Add button triggers an event when clicked", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button"));
        expect(mockProps.handleAddFriendClick).toHaveBeenCalled();
    });

    it("Unfriend button triggers an event when clicked", async () => {
        const user = userEvent.setup();
        setup({
            isAddedAsFriend: true
        });

        await user.click(screen.getByRole("button"));
        expect(mockProps.handleUnfriendClick).toHaveBeenCalled();
    });
});