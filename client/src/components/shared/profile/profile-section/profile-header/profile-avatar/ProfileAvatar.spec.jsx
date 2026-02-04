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
    it("renders user image with correct alt and src attributes", () => {
        const img = screen.getByAltText("Profile picture");

        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", mockProps.userData.imageUrl);
    });
});