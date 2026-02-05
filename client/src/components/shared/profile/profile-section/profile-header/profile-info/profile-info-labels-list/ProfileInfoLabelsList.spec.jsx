import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ProfileInfoLabelsList from "./ProfileInfoLabelsList.jsx";

vi.mock("./profile-info-label/ProfileInfoLabel", () => ({
    default: ({ label, userData }) => (
        <div data-testid="profile-info-label">
            <span data-testid="label-key" >{label.labelText}</span>
            <span data-testid="label-text" >{label.labelKey}</span>
            <span data-testid="label-key" >{userData[label.labelKey]}</span>
        </div>
    )
}));

const mockProps = {
    userData: {
        bio: 'Coder',
        age: '25',
        gender: 'Male',
        location: 'Earth',
        occupation: 'Developer',
        education: 'CS Degree',
        status: 'Active',
        memberSince: '25.08.2025',
    }
};

beforeEach(() => {
    render(<ProfileInfoLabelsList {...mockProps} />);
});

describe("profileInfoLabelsList", () => {
    it("renders the correct number of ProfileInfoLabel components", () => {
        expect(screen.getAllByTestId('profile-info-label')).toHaveLength(8);
    });

    it("passes correct props to each ProfileInfoLabel component", () => {
        expect(screen.getByText("Bio:")).toBeInTheDocument();
        expect(screen.getByText("Age:")).toBeInTheDocument();
        expect(screen.getByText("Gender:")).toBeInTheDocument();
        expect(screen.getByText("Location:")).toBeInTheDocument();
        expect(screen.getByText("Occupation:")).toBeInTheDocument();
        expect(screen.getByText("Education:")).toBeInTheDocument();
        expect(screen.getByText("Status:")).toBeInTheDocument();
        expect(screen.getByText("Member Since:")).toBeInTheDocument();

        expect(screen.getByText(mockProps.userData.bio)).toBeInTheDocument();
        expect(screen.getByText(mockProps.userData.memberSince)).toBeInTheDocument();
        expect(screen.getByText(mockProps.userData.gender)).toBeInTheDocument();
    })
})