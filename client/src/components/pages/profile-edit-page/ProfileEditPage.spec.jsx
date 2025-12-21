import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React from "react";

import ProfileEditPage from "./ProfileEditPage";

import { AlertContext } from "../../../contexts/alert-context"
import { ActionsContext } from "../../../contexts/actions-context"
import { UserContext } from "../../../contexts/user-context"

import useUserServices from "../../../hooks/useUserServices"

vi.mock("../../shared/user-details/gender-details/GenderDetails", () => ({
    default: ({ userGender }) => <input
        data-testid="gender-details"
        name="gender"
        type="text"
        defaultValue={userGender}
    />
}));

vi.mock("../../ui/headings/SectionHeading", () => ({
    default: ({ sectionName }) => <div data-testid="section-heading">{sectionName}</div>
}));

vi.mock("./image-upload/ImageUpload", () => ({
    default: ({ imageUrl }) => <>
        <img src={imageUrl} data-testid="image-upload" />
    </>
}));

vi.mock("./profile-bio-textarea/ProfileBioTextArea", () => ({
    default: ({ userData }) => <textarea
        data-testid="profile-bio"
        name="bio"
        defaultValue={userData.bio}
    />
}));

vi.mock("./profile-edit-buttons/ProfileEditButtons", () => ({
    default: () => <>
        <ActionsContext.Consumer>
            {actions => (
                <button
                    data-testid="edit-profile-cancel-button"
                    onClick={(e) => actions.onCancelEditClickHandler(e.currentTarget)}
                >
                </button>
            )}
        </ActionsContext.Consumer>
    </>
}));

vi.mock("../../shared/input-fields/input-fields-list/InputFieldsList", () => ({
    default: ({ inputFields }) => inputFields.map(field => (
        <React.Fragment key={field.inputName}>
            <label
                data-testid="label-el"
                htmlFor={field.inputName}
            >{field.fieldName}</label>
            <input
                data-testid="input-el"
                type={field.inputType}
                id={field.inputName}
                defaultValue={field.value}
            />
        </React.Fragment>
    ))
}));

vi.mock("../../../hooks/useUserServices");

vi.mock("react-router", () => ({
    useNavigate: () => vi.fn(),
    useParams: () => useParamsMock(),
}));

const useParamsMock = vi.fn()

describe("ProfileEditPage component", () => {
    const updateUser = vi.fn();
    const getUserData = vi.fn();
    const abortAll = vi.fn();
    const setAlert = vi.fn();
    const isUser = "curUserId";

    const userData = {
        gender: "Male",
        imageUrl: "https://www.example.org/example-image.webp",
        bio: "This is my bio",
        firstName: "Ivan",
        lastName: "Petrov",
        birthday: "19.03.1998",
        location: "Sofia",
        occupation: "JS Developer",
        education: "N/A",
        status: "Single",
    };

    const formProfileInputs = [
        { fieldName: 'First name', inputType: 'text', inputName: 'firstName', value: userData?.firstName },
        { fieldName: 'Last name', inputType: 'text', inputName: 'lastName', value: userData?.lastName },
        { fieldName: 'Birthday', inputType: 'date', inputName: 'birthday', value: userData?.birthday },
        { fieldName: 'Location', inputType: 'text', inputName: 'location', value: userData?.location },
        { fieldName: 'Occupation', inputType: 'text', inputName: 'occupation', value: userData?.occupation },
        { fieldName: 'Education', inputType: 'text', inputName: 'education', value: userData?.education },
        { fieldName: 'Status', inputType: 'text', inputName: 'status', value: userData?.status },
    ];

    function renderComp(
        options = {
            updateUserResult: true,
            getUserDataResult: true,
            useParamsMockValue: "someUserId"
        }
    ) {
        useParamsMock.mockReturnValue({ userId: options.useParamsMockValue });

        const updateUserMock = options.updateUserResult ?
            updateUser.mockResolvedValue(true) :
            updateUser.mockRejectedValue(new Error("Successfully rejected updateUser!"));

        const getUserDataMock = options.getUserDataResult ?
            getUserData.mockResolvedValue(userData) :
            getUserData.mockRejectedValue(new Error("Successfully rejected getUserData!"));

        useUserServices.mockReturnValue({
            updateUser: updateUserMock,
            getUserData: getUserDataMock,
            abortAll,
        })

        const { unmount } = render(
            <AlertContext.Provider value={{ setAlert }}>
                <UserContext.Provider value={{ isUser }}>
                    <ProfileEditPage />
                </UserContext.Provider>
            </AlertContext.Provider>
        );

        return unmount;
    }

    it("renders SectionHeading with props", () => {
        const pattern = /^Edit Profile:$/

        renderComp();

        expect(screen.getByTestId("section-heading")).toHaveTextContent(pattern);
    });

    it("renders ImageUpload with passed props", async () => {
        renderComp();

        expect(await screen.findByTestId("image-upload")).toHaveAttribute("src", userData.imageUrl);
    });

    it("renders GenderDetails with passed defaultValue", async () => {
        renderComp();

        expect(await screen.findByTestId("gender-details")).toHaveValue(userData.gender);
    });

    it("renders ProfileBioTextArea with passed props", async () => {
        renderComp();

        expect(await screen.findByTestId("profile-bio")).toHaveValue(userData.bio);
    })
});