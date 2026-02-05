import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProfileSection from "./ProfileSection.jsx";

vi.mock("../../../ui/loading-spinner/LoadingSpinner", () => ({
    default: () => (
        <div data-testid="loading-spinner"></div>
    )
}));

vi.mock("./profile-header/ProfileHeader", () => ({
    default: ({userData}) => (
        <div data-testid="profile-header">
            {userData}
        </div>
    )
}));

describe('ProfileSection component', () => {
    it("shows LoadingSpinner when isLoading is true", () => {
        render(
            <ProfileSection
                isLoading={true}
                userData={"Test1"}
            />
        )

        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
        
        expect(screen.queryByTestId("profile-header")).not.toBeInTheDocument();
    });
    
    it("shows ProfileHeader when isLoading is false", () => {
        render(
            <ProfileSection
                isLoading={false}
                userData={"Test1"}
            />
        )

        expect(screen.getByTestId("profile-header")).toHaveTextContent("Test1");

        expect(screen.getByTestId("loading-spinner")).not.toBeInTheDocument();
    });
})