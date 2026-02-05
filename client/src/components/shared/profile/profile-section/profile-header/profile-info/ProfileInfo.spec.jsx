import { useParams } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../../../../../contexts/user-context.js";

import ProfileInfo from "./ProfileInfo.jsx";

vi.mock("./profile-fullname/ProfileFullname", () => ({
    default: ({userData}) => (
        <div data-testid="profile-fullname">
            {userData.fullName}
        </div>
    )
}));

vi.mock("./profile-info-labels-list/ProfileInfoLabelsList", () => ({
    default: ({userData}) => (
        <div data-testid="profile-info">
            {userData.info}
        </div>
    )
}));

vi.mock("./edit-profile-button/EditProfileButton", () => ({
    default: () => (
        <button type="button" data-testid="edit-button">
        </button>
    )
}));

vi.mock("react-router", () => ({
    useParams: vi.fn(),
}));

const userData ={
    fullName: "Fullname test",
    info: "Info test"
};

function setup(options={
    isUserIsNull: false,
    isUserIsMatching: false,
}) {
    const userId = "OriginalUser";
    let isUser;

    if (options.isUserIsNull) {
        isUser = null;
    } else if (options.isUserIsMatching) {
        isUser = userId;
    } else {
        isUser = "randomId";
    };

    useParams.mockReturnValue({ userId, });

    render(
        <UserContext.Provider value={{ isUser, }}>
            <ProfileInfo userData={userData} />
        </UserContext.Provider>
    );  
};

describe("ProfileInfo Component", () => {
    it("renders user full name and profile information on passed user data", () => {
        setup();

        expect(screen.getByTestId("profile-fullname")).toHaveTextContent(userData.fullName);
        expect(screen.getByTestId("profile-info")).toHaveTextContent(userData.info);
    });

    it("does not render profile edit button when user is not logged in", () => {
        setup({
            isUserIsMatching: false,
            isUserIsNull: true,
        })

        expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
    });

    it("renders profile edit button with matching user is logged in and in his profile page", () => {
        setup({
            isUserIsMatching: true,
            isUserIsNull: false,
        });

        expect(screen.getByTestId("edit-button")).toBeInTheDocument();
    });
});