import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AddFriendButton from "./AddFriendButton";

vi.mock("../../../../../../ui/buttons/button/Button", () => ({
    default: ({ onClickHandler, buttonName }) => (
        <button
            data-testid="button"
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
            expect(screen.getByTestId("button")).toHaveTextContent("Unfriend");
        } else {
            expect(screen.getByTestId("button")).toHaveTextContent("Add");
        }
    });

    it.each([
        { button: "Add", handler: "handleAddFriendClick", isAdded: false },
        { button: "Unfriend", handler: "handleUnfriendClick", isAdded: true },
    ])("on $button button triggers $handler on click", ({ isAdded }) => {
        setup({
            isAddedAsFriend: isAdded
        });

        fireEvent.click(screen.getByTestId("button"));

        if(isAdded) {
            expect(mockProps.handleUnfriendClick).toHaveBeenCalled();
        }else{
            expect(mockProps.handleAddFriendClick).toHaveBeenCalled();
        };
    });
});