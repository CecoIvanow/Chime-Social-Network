import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ProfileHeader from "./ProfileHeader.jsx";

vi.mock("./profile-avatar/ProfileAvatar", () => ({
    default: ({userData}) => 
        <div data-testid="profile-avatar" >
            {userData}
        </div>
}));

vi.mock("./profile-info/ProfileInfo", () => ({
    default: ({userData}) => 
        <div data-testid="profile-info">
            {userData}
        </div>
}));

const mockProps = {
    userData: "Test123",
};

beforeEach(() => {
    render(
        <ProfileHeader
            {...mockProps}
        />
    );
});

describe("ProfileHeader component", () => {
    it("renders both child components and passes userData", () => {
        expect(screen.getByTestId('profile-avatar')).toBeInTheDocument();
        expect(screen.getByTestId('profile-info')).toBeInTheDocument();
        
        expect(screen.getAllByText(mockProps.userData)).toHaveLength(2);
    });
});