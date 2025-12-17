import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FriendItem from "./FriendItem";

describe("FrientItem component", () => {
    const friend = {
        imageUrl: "https://fake-image.com/ThisIsAFakeImageUrl",
        firstName: "Ivan",
        lastName: "Ivanov"
    }

    const onClickHandler = vi.fn();

    it("renders FriendItem component with passed props", () => {
        render(
            <FriendItem
                friend={friend}
                onClickHandler={onClickHandler}
            />
        );

        expect(screen.getByText(`${friend.firstName} ${friend.lastName}`)).toBeInTheDocument();
        expect(screen.getByAltText("Profile Picture")).toHaveAttribute('src', friend.imageUrl);
    });
});