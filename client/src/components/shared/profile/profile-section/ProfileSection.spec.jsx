import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProfileSection from "./ProfileSection.jsx";

vi.mock("../../../ui/loading-spinner/LoadingSpinner", () => ({
    default: () => (
        <div>
            {"Loading Spinner"}
        </div>
    )
}));

vi.mock("./profile-header/ProfileHeader", () => ({
    default: ({userData}) => (
        <div>
            {userData}
        </div>
    )
}))

describe('ProfileSection component', () => {
    it("shows LoadingSpinner when isLoading is true", () => {
        render(
            <ProfileSection
                isLoading={true}
                userData={"Test1"}
            />
        )

        expect(screen.getByText('Loading Spinner')).toBeInTheDocument();
        
        expect(screen.queryByText("Test1")).not.toBeInTheDocument();
    });
    
    it("shows ProfileHeader when isLoading is false", () => {
        render(
            <ProfileSection
                isLoading={false}
                userData={"Test1"}
            />
        )

        expect(screen.getByText("Test1")).toBeInTheDocument();

        expect(screen.queryByText('Loading Spinner')).not.toBeInTheDocument();
    });
})