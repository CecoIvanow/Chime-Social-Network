import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import FriendItem from "./FriendItem";

const mockProps = {
    friend: {
        imageUrl: "https://fake-image.com/ThisIsAFakeImageUrl",
        firstName: "Ivan",
        lastName: "Ivanov"
    },
    onClickHandler: vi.fn(),
};

beforeEach(() => {
    render(
        <FriendItem
            {...mockProps}
        />
    );
});


describe("FrientItem component", () => {
    const friendName = `${mockProps.friend.firstName} ${mockProps.friend.lastName}`;
    
    it("renders the correct friend full name", () => {
        expect(screen.getByRole("listitem", { value: friendName })).toBeInTheDocument();
    });

    it("renders profile picture image with correct src and alt attributes", () => {
        expect(screen.getByRole("img")).toHaveAttribute("src", mockProps.friend.imageUrl);
        expect(screen.getByRole("img")).toHaveAttribute("alt", "Profile Picture");
    });

    it("triggers an event on click", async () => {
        const user = userEvent.setup();

        await user.click(screen.getByRole("listitem", { value: friendName }));
        expect(mockProps.onClickHandler).toHaveBeenCalled();
    });
});