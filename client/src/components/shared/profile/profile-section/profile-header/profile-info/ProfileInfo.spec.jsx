import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../../../../../contexts/user-context.js";

import ProfileInfo from "./ProfileInfo.jsx";

vi.mock("react-router", () => ({
    useParams: () => reactRouterMock.useParams(),
}));

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

const userData ={
    fullName: "Fullname test",
    info: "Info test"
};

const reactRouterMock = {
    useParams: vi.fn(),
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

    reactRouterMock.useParams.mockReturnValue({ userId, });

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

    it("does not render the profile edit button when user is not logged in or is logged in and not in their profile", () => {
        setup({
            isUserIsMatching: false,
            isUserIsNull: true,
        })

        expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
    });

    it("renders profile edit button when the user is logged in and in their profile page", () => {
        setup({
            isUserIsMatching: true,
            isUserIsNull: false,
        });

        expect(screen.getByTestId("edit-button")).toBeInTheDocument();
    });
});