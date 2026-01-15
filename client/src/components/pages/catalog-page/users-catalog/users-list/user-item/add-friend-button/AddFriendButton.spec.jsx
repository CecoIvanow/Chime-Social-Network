import { fireEvent, prettyDOM, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

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

const handleAddFriendClickMock = vi.fn();
const handleUnFriendClickMock = vi.fn();

function setup(options = {
    isAddedAsFriend: false
}) {

    render(
        <AddFriendButton
            isAddedAsFriend={options.isAddedAsFriend}
            handleAddFriendClick={handleAddFriendClickMock}
            handleUnfriendClick={handleUnFriendClickMock}
        />
    );
};

describe("AddFriendButton component", () => {
    it.each([
        { button: "Add", isAdded: false },
        { button: "Unfriend", isAdded: true },
    ])("renders $button on isAddedAsFriend $isAdded", ({ isAdded }) => {
        setup({
            isAddedAsFriend: isAdded
        });

        if (isAdded) {
            expect(screen.getByTestId("button")).toHaveTextContent("Unfriend");
        } else {
            expect(screen.getByTestId("button")).toHaveTextContent("Add");
        }
    })
});