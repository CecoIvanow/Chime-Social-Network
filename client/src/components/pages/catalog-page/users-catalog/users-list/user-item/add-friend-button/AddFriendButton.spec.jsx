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
        { button: "Add", isAdded: false },
        { button: "Unfriend", isAdded: true },
    ])("renders $button button on isAddedAsFriend $isAdded", ({ isAdded }) => {
        setup({
            isAddedAsFriend: isAdded
        });

        if (isAdded) {
            expect(screen.getByRole("button", { name: "Unfriend"})).toBeInTheDocument();
        } else {
            expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
        };
    });

    it.each([
        { button: "Add", handler: "handleAddFriendClick", isAdded: false },
        { button: "Unfriend", handler: "handleUnfriendClick", isAdded: true },
    ])("on $button button triggers $handler on click", async ({ isAdded }) => {
        const user = userEvent.setup();
        setup({
            isAddedAsFriend: isAdded
        });

        await user.click(screen.getByRole("button"));

        if(isAdded) {
            expect(mockProps.handleUnfriendClick).toHaveBeenCalled();
        }else{
            expect(mockProps.handleAddFriendClick).toHaveBeenCalled();
        };
    });
});