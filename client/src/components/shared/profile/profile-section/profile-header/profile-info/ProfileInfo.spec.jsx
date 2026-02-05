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
    }

    useParams.mockReturnValue({ userId, });

    render(
        <UserContext.Provider value={{ isUser, }}>
            <ProfileInfo userData={userData} />
        </UserContext.Provider>
    );  
};

describe("ProfileInfo Component", () => {
    it("renders ProfileFullName and ProfileInfoLabelsList with passed userData", () => {
        setup({
            isUserIsMatching: false,
            isUserIsNull: false,
        });

        expect(screen.getByTestId("profile-fullname")).toHaveTextContent(userData.fullName);
        expect(screen.getByTestId("profile-info")).toHaveTextContent(userData.info);
    });

    it("does not render EditProfileButton with false isUser", () => {
        setup({
            isUserIsMatching: false,
            isUserIsNull: true,
        })

        expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    });

    it("renders EditProfileButton with matching isUser and userId", () => {
        setup({
            isUserIsMatching: true,
            isUserIsNull: false,
        });

        expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    });
})