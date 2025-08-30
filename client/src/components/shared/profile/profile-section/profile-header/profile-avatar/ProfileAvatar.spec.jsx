import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ProfileAvatar from "./ProfileAvatar.jsx";

const mockProps = {
    userData: {
        imageUrl: "https://example.com/avatar.png"
    }
}

describe("ProfileAvatar", () => {
    it("renders user image with correct alt and src", () => {
        render(<ProfileAvatar userData={mockProps.userData} />)

        const img = screen.getByAltText("Profile picture");

        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', mockProps.userData.imageUrl);
    })
})