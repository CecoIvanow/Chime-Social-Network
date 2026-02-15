import React from "react";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase/firebase-storage/config";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../contexts/actions-context"
import { AlertContext } from "../../../contexts/alert-context"
import { UserContext } from "../../../contexts/user-context"

import ProfileEditPage from "./ProfileEditPage";

vi.mock("react-router", () => ({
    useNavigate: () => reactRouterMock.navigateTo,
    useParams: () => reactRouterMock.useParams(),
}));

vi.mock("firebase/storage", () => ({
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
}));

vi.mock("../../../firebase/firebase-storage/config", () => ({
    storage: {},
}));

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({
        ...userUserServicesMock
    })
}));

vi.mock("../../ui/headings/SectionHeading", () => ({
    default: ({ sectionName }) => <div data-testid="section-heading">{sectionName}</div>
}));

vi.mock("./image-upload/ImageUpload", () => ({
    default: ({ imageUrl, setImageUpload }) => <>
        <img src={imageUrl} />
        <input
            data-testid="image-upload-input"
            type="file"
            onChange={(e) => setImageUpload(e.target.files[0])}
        />
    </>
}));

vi.mock("../../shared/user-details/gender-details/GenderDetails", () => ({
    default: ({ userGender }) => (
        <input
            data-testid="gender-details"
            type="text"
            defaultValue={userGender}
        />
    )
}));

vi.mock("../../shared/input-fields/input-fields-list/InputFieldsList", () => ({
    default: ({ inputFields }) => inputFields.map(field => (
        <React.Fragment key={field.inputName}>
            <label
                htmlFor={field.inputName}
            >{field.fieldName}</label>
            <input
                type={field.inputType}
                id={field.inputName}
                defaultValue={field.value}
            />
        </React.Fragment>
    ))
}));

vi.mock("./profile-bio-textarea/ProfileBioTextArea", () => ({
    default: ({ userData }) => <div data-testid="profile-bio"> {userData.bio} </div>
}));

vi.mock("./profile-edit-buttons/ProfileEditButtons", () => ({
    default: () => (
        <ActionsContext.Consumer>
            {actions => (
                <>
                    <button onClick={(e) => actions.onCancelEditClickHandler(e)}>Cancel</button>

                    <button type="submit" >Submit</button>
                </>
            )}
        </ActionsContext.Consumer>
    )
}));

const isUser = "curUserId";

const ERR_MSG = {
    GET_USER_DATA: "Rejected getUserData call!",
    UPDATE_USER: "Rejected updateUser call!",
}

const userData = {
    gender: "Male",
    imageUrl: "https://www.example.org/example-image.webp",
    bio: "This is my bio",
    firstName: "Ivan",
    lastName: "Petrov",
    birthday: "1998-03-19",
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

const userUserServicesMock = {
    updateUser: vi.fn(),
    getUserData: vi.fn(),
    abortAll: vi.fn(),
};

const reactRouterMock = {
    useParams: vi.fn(),
    navigateTo: vi.fn(),
};

const setAlert = vi.fn();

function setup(
    options = {
        updateUserResult: true,
        getUserDataResult: true,
        useParamsMockValue: isUser,
    }
) {
    ref.mockReturnValue("mock-image-ref");

    uploadBytes.mockResolvedValue({
        ref: "mock-image-ref",
    });

    getDownloadURL.mockResolvedValue(
        "https://firebase.mock/avatar.webp"
    );

    reactRouterMock.useParams.mockReturnValue({ userId: options.useParamsMockValue });

    userUserServicesMock.updateUser = options.updateUserResult ?
        userUserServicesMock.updateUser.mockResolvedValue(true) :
        userUserServicesMock.updateUser.mockRejectedValue(new Error(ERR_MSG.UPDATE_USER));

    userUserServicesMock.getUserData = options.getUserDataResult ?
        userUserServicesMock.getUserData.mockResolvedValue(userData) :
        userUserServicesMock.getUserData.mockRejectedValue(new Error(ERR_MSG.GET_USER_DATA));

    const { unmount } = render(
        <AlertContext.Provider value={{ setAlert }}>
            <UserContext.Provider value={{ isUser }}>
                <ProfileEditPage />
            </UserContext.Provider>
        </AlertContext.Provider>
    );

    return unmount;
};

describe("ProfileEditPage component", () => {
    it("renders section heading with correct text", () => {
        setup();

        expect(screen.getByTestId("section-heading")).toHaveTextContent("Edit Profile");
    });

    it("renders the user avatar", async () => {
        setup();

        expect(await screen.findByRole("img")).toHaveAttribute("src", userData.imageUrl);
    });

    it("renders the user's chosen gender", async () => {
        setup();

        expect(await screen.findByTestId("gender-details")).toHaveValue(userData.gender);
    });

    it("renders and connects the correct amount of profile input fields with the correct type and value attributes", async () => {
        setup();

        for (let i = 0; i < formProfileInputs.length; i++) {
            expect(screen.getByLabelText(formProfileInputs[i].fieldName)).toHaveAttribute("type", formProfileInputs[i].inputType);
            expect( await screen.findByLabelText(formProfileInputs[i].fieldName)).toHaveValue(formProfileInputs[i].value);
        };
    });

    it("renders the user's profile bio with correct data", async () => {
        setup();

        expect(await screen.findByTestId("profile-bio")).toHaveTextContent(userData.bio);
    });

    it("on cancel button click redirects to the user's profile", () => {
        setup();

        const cancelButton = screen.getByRole("button", { name: "Cancel" });

        expect(cancelButton).toBeInTheDocument();

        fireEvent.click(cancelButton);

        expect(reactRouterMock.navigateTo).toHaveBeenCalledWith(`/profile/${isUser}`);
    });

    it("shows error message on rejected user data call", async () => {
        setup({
            getUserDataResult: false,
            updateUserResult: true,
            useParamsMockValue: isUser,
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalled();
        })
    });

    it("if the logged in user is not the profile owner redirects to /404", () => {
        setup({
            getUserDataResult: true,
            updateUserResult: true,
            useParamsMockValue: "differentId",
        });

        expect(reactRouterMock.navigateTo).toHaveBeenCalledWith("/404");
    });

    it("on successfull form submit redirects to the user's profile", async () => {
        setup();

        fireEvent.click(
            screen.getByRole("button", { name: "Submit" })
        );

        await waitFor(() => {
            expect(userUserServicesMock.updateUser).toHaveBeenCalled();
            expect(reactRouterMock.navigateTo).toHaveBeenCalledWith(`/profile/${isUser}`);
        });
    });

    it("shows error message on a rejected form submit call", async () => {
        setup({
            updateUserResult: false,
            getUserDataResult: true,
            useParamsMockValue: isUser,
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Submit" })
        );

        await waitFor(() => {
            expect(userUserServicesMock.updateUser).toHaveBeenCalled();
            expect(reactRouterMock.navigateTo).not.toHaveBeenCalled();
            expect(setAlert).toHaveBeenCalled();
        });
    });

    it("uploads image to Firebase storage on form submit when image is uploaded", async () => {
        uploadBytes.mockResolvedValueOnce({
            ref: "mock-image-ref",
        });

        setup();

        const mockFile = new File(["mock-content"], "avatar.png", { type: "image/png" });
        const fileInput = screen.getByTestId("image-upload-input");

        fireEvent.change(fileInput, { target: { files: [mockFile] } });
        fireEvent.click(screen.getByRole("button", { name: "Submit" }));

        await waitFor(() => {
            expect(ref).toHaveBeenCalledWith(storage, `/images/${isUser}/avatar`);
            expect(uploadBytes).toHaveBeenCalledWith("mock-image-ref", mockFile);
            expect(getDownloadURL).toHaveBeenCalledWith("mock-image-ref");
        });
    });

    it("stops all ongoing calls on unmount", () => {
        const unmount = setup();

        unmount();

        expect(userUserServicesMock.abortAll).toHaveBeenCalled();
    });
});