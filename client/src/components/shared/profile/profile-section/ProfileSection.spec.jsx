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

function setup(options={
    isLoading: false,
}) {
    
    render(
        <ProfileSection
            isLoading={options.isLoading}
            userData={"Test1"}
        />
    );
};

describe('ProfileSection component', () => {
    it("shows ProfileHeader when isLoading is false", () => {
        setup();

        expect(screen.getByTestId("profile-header")).toHaveTextContent("Test1");

        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    it("shows LoadingSpinner when isLoading is true", () => {
        setup({
            isLoading: true,
        });

        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
        
        expect(screen.queryByTestId("profile-header")).not.toBeInTheDocument();
    });
});