import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import ProfileAvatar from "./ProfileAvatar.jsx";

const mockProps = {
    userData: {
        imageUrl: "https://example.com/avatar.png"
    }
};

beforeEach(() => {
    render(
        <ProfileAvatar {...mockProps} />
    );
});

describe("ProfileAvatar component", () => {
    it("renders profile avatar with correct alt and src attributes", () => {
        const img = screen.getByRole("img");

        expect(img).toHaveAttribute("alt", "Profile picture");
        expect(img).toHaveAttribute("src", mockProps.userData.imageUrl);
    });
});