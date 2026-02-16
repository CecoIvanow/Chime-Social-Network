import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import FriendItem from "./FriendItem";

const friend = {
    imageUrl: "https://fake-image.com/ThisIsAFakeImageUrl",
    firstName: "Ivan",
    lastName: "Ivanov"
}

const onClickHandler = vi.fn();

beforeEach(() => {
    render(
        <FriendItem
            friend={friend}
            onClickHandler={onClickHandler}
        />
    );
});

describe("FrientItem component", () => {
    it("renders FriendItem component with passed props", () => {
        expect(screen.getByText(`${friend.firstName} ${friend.lastName}`)).toBeInTheDocument();
        expect(screen.getByAltText("Profile Picture")).toHaveAttribute('src', friend.imageUrl);
    });

    it("triggers onClickHandler on click", () => {
        fireEvent.click(screen.getByText(`${friend.firstName} ${friend.lastName}`));

        expect(onClickHandler).toHaveBeenCalledOnce();
    });
});