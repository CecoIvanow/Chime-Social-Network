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

describe("ProfileInfo Component", () => {
    it("renders ProfileFullName and ProfileInfoLabelsList with passed userData", () => {
        useParams.mockReturnValue({ userId: "OriginalUser" });

        render(
            <UserContext.Provider value={{ isUser: "Test" }}>
                <ProfileInfo userData={userData}/>
            </UserContext.Provider>
        )

        const fullNameComp = screen.getByTestId("profile-fullname");
        const infoComp = screen.getByTestId("profile-info");

        expect(fullNameComp).toBeInTheDocument();
        expect(infoComp).toBeInTheDocument();

        expect(fullNameComp).toHaveTextContent(userData.fullName);
        expect(infoComp).toHaveTextContent(userData.info);
    });

    it("does not render EditProfileButton with false isUser", () => {
        useParams.mockReturnValue({ userId: "OriginalUser" });

        render(
            <UserContext.Provider value={{ isUser: null }}>
                <ProfileInfo userData={userData}/>
            </UserContext.Provider>
        )

        expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    });

    it("renders EditProfileButton with matching isUser and userId", () => {
        useParams.mockReturnValue({ userId: "OriginalUser" });

        render(
            <UserContext.Provider value={{ isUser: "OriginalUser" }}>
                <ProfileInfo userData={userData}/>
            </UserContext.Provider>
        )

        expect(screen.queryByTestId('edit-button')).toBeInTheDocument();
    });
})