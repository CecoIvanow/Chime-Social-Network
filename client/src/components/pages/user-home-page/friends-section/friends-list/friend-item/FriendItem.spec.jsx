import { fireEvent, render, screen } from "@testing-library/react";
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
    it("renders FriendItem component with passed props", () => {
        expect(screen.getByText(`${mockProps.friend.firstName} ${mockProps.friend.lastName}`)).toBeInTheDocument();
        expect(screen.getByAltText("Profile Picture")).toHaveAttribute('src', mockProps.friend.imageUrl);
    });

    it("triggers onClickHandler on click", () => {
        fireEvent.click(screen.getByText(`${mockProps.friend.firstName} ${mockProps.friend.lastName}`));

        expect(mockProps.onClickHandler).toHaveBeenCalledOnce();
    });
});