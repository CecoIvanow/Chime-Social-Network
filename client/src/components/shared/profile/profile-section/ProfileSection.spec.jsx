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

const mockProps = {
    userData: "Test1",
}

function setup(options={
    isLoading: false,
}) {
    
    render(
        <ProfileSection
            isLoading={options.isLoading}
            {...mockProps}
        />
    );
};

describe('ProfileSection component', () => {
    it("renders a loading spinner instead of the profile header while data is loading", () => {
        setup({
            isLoading: true,
        });

        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

        expect(screen.queryByTestId("profile-header")).not.toBeInTheDocument();
    });

    it("renders the profile header instea of a loading spinner after the data has loaded", () => {
        setup();

        expect(screen.getByTestId("profile-header")).toHaveTextContent(mockProps.userData);

        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
});