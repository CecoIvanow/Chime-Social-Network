import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ProfileInfoLabelsList from "./ProfileInfoLabelsList.jsx";

vi.mock("./profile-info-label/ProfileInfoLabel", () => ({
    default: ({ label, userData }) => (
        <div data-testid="profile-info-label">
            <div>{label.labelText}</div>
            <div>{userData[label.labelKey]}</div>
        </div>
    )
}));

const labelTextArr = [
    "Bio:",
    "Age:",
    "Gender:",
    "Location:",
    "Occupation:",
    "Education:",
    "Status:",
    "Member Since:"
];

const mockProps = {
    userData: {
        bio: "Coder",
        age: "25",
        gender: "Male",
        location: "Earth",
        occupation: "Developer",
        education: "CS Degree",
        status: "Active",
        memberSince: "25.08.2025",
    }
};

beforeEach(() => {
    render(<ProfileInfoLabelsList {...mockProps} />);
});

describe("profileInfoLabelsList", () => {
    it("renders the correct number of ProfileInfoLabel components", () => {
        const amountOfChildComponents = Object.keys(mockProps.userData).length;

        expect(screen.getAllByTestId("profile-info-label")).toHaveLength(amountOfChildComponents);
    });

    it("renders ProfileInfoLabel component with user data values", () => {
        for (const label of labelTextArr) {
            expect(screen.getByText(label)).toBeInTheDocument();
        };

        for (const key in mockProps.userData) {
            expect(screen.getByText(mockProps.userData[key])).toBeInTheDocument();
        };
    });
});