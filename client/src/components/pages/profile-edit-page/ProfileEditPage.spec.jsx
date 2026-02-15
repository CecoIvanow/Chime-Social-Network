import React from "react";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase/firebase-storage/config";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { ActionsContext } from "../../../contexts/actions-context"
import { AlertContext } from "../../../contexts/alert-context"
import { UserContext } from "../../../contexts/user-context"

import useUserServices from "../../../hooks/useUserServices"

import ProfileEditPage from "./ProfileEditPage";

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
    default: ({ imageUrl, setImageUpload }) => <>
        <img src={imageUrl} data-testid="image-upload" />
        <input
            data-testid="image-upload-input"
            type="file"
            onChange={(e) => setImageUpload(e.target.files[0])}
        />
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
            {actions => <>
                <button
                    data-testid="edit-profile-cancel-button"
                    onClick={(e) => actions.onCancelEditClickHandler(e)}
                >
                </button>
                <button
                    data-testid="edit-profile-submit-button"
                    type="submit"
                >
                </button>
            </>
            }
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

vi.mock("firebase/storage", () => ({
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
}));

vi.mock("../../../firebase/firebase-storage/config", () => ({
    storage: {},
}))

vi.mock("../../../hooks/useUserServices");

vi.mock("react-router", () => ({
    useNavigate: () => navigateMock,
    useParams: () => useParamsMock(),
}));

const useParamsMock = vi.fn();
const navigateMock = vi.fn();

const updateUser = vi.fn();
const getUserData = vi.fn();
const abortAll = vi.fn();
const setAlert = vi.fn();
const isUser = "curUserId";

ref.mockReturnValue("mock-image-ref");

uploadBytes.mockResolvedValue({
    ref: "mock-image-ref",
});

getDownloadURL.mockResolvedValue(
    "https://firebase.mock/avatar.webp"
);

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

function setup(
    options = {
        updateUserResult: true,
        getUserDataResult: true,
        useParamsMockValue: isUser,
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
};

beforeEach(() => {
    ref.mockReturnValue("mock-image-ref");

    uploadBytes.mockResolvedValue({
        ref: "mock-image-ref",
    });

    getDownloadURL.mockResolvedValue(
        "https://firebase.mock/avatar.webp"
    );
});

describe("ProfileEditPage component", () => {
    it("renders SectionHeading with props", () => {
        const pattern = /^Edit Profile:$/

        setup();

        expect(screen.getByTestId("section-heading")).toHaveTextContent(pattern);
    });

    it("renders ImageUpload with passed props", async () => {
        setup();

        expect(await screen.findByTestId("image-upload")).toHaveAttribute("src", userData.imageUrl);
    });

    it("renders GenderDetails with passed defaultValue", async () => {
        setup();

        expect(await screen.findByTestId("gender-details")).toHaveValue(userData.gender);
    });

    it("renders ProfileBioTextArea with passed props", async () => {
        setup();

        expect(await screen.findByTestId("profile-bio")).toHaveValue(userData.bio);
    });

    it("renders InputFieldsList with passed props", async () => {

        setup();

        const labelsEl = screen.getAllByTestId("label-el");
        const inputsEl = screen.getAllByTestId("input-el");
        const inputs = await screen.findAllByTestId("input-el");

        for (let i = 0; i < formProfileInputs.length; i++) {
            const pattern = new RegExp(`^${formProfileInputs[i].fieldName}$`);

            expect(labelsEl[i]).toHaveTextContent(pattern);
            expect(labelsEl[i]).toHaveAttribute("for", formProfileInputs[i].inputName);

            expect(inputsEl[i]).toHaveAttribute("type", formProfileInputs[i].inputType);
            expect(inputsEl[i]).toHaveAttribute("id", formProfileInputs[i].inputName);
            expect(inputs[i]).toHaveValue(formProfileInputs[i].value);
        };
    });

    it("on cancel edit click handler triggers on ProfileEditButtons cancellation", () => {
        setup();

        const cancelButton = screen.getByTestId("edit-profile-cancel-button");

        expect(cancelButton).toBeInTheDocument();

        fireEvent.click(cancelButton);

        expect(navigateMock).toHaveBeenCalledWith(`/profile/${isUser}`);
    });

    it("triggers setAlert on rejected getUserData call", async () => {
        setup({
            getUserDataResult: false,
            updateUserResult: true,
            useParamsMockValue: isUser,
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalled();
        })
    });

    it("on different useParams and userId triggers navigateTo with /404", () => {
        setup({
            getUserDataResult: true,
            updateUserResult: true,
            useParamsMockValue: "differentId",
        });

        expect(navigateMock).toHaveBeenCalledWith("/404");
    });

    it("triggers navigateTo on successful form submit", async () => {
        setup();

        fireEvent.click(
            screen.getByTestId("edit-profile-submit-button")
        );

        await waitFor(() => {
            expect(updateUser).toHaveBeenCalled();
            expect(navigateMock).toHaveBeenCalledWith(`/profile/${isUser}`);
        });
    });

    it("triggers setAlert on rejected form submit", async () => {
        setup({
            updateUserResult: false,
            getUserDataResult: true,
            useParamsMockValue: isUser,
        });

        fireEvent.click(
            screen.getByTestId("edit-profile-submit-button")
        );

        await waitFor(() => {
            expect(updateUser).toHaveBeenCalled();
            expect(navigateMock).not.toHaveBeenCalled();
            expect(setAlert).toHaveBeenCalled();
        });
    });


    it("triggers abortAll on unmount", () => {
        const unmount = setup();

        unmount();

        expect(abortAll).toHaveBeenCalled();
    });

    it("uploads image to Firebase storage on form submit when image is selected", async () => {
        uploadBytes.mockResolvedValueOnce({
            ref: "mock-image-ref",
        });

        setup();

        const mockFile = new File(["mock-content"], "avatar.png", { type: "image/png" });
        const fileInput = screen.getByTestId("image-upload-input");

        fireEvent.change(fileInput, { target: { files: [mockFile] } });
        fireEvent.click(screen.getByTestId("edit-profile-submit-button"));

        await waitFor(() => {
            expect(ref).toHaveBeenCalledWith(storage, `/images/${isUser}/avatar`);
            expect(uploadBytes).toHaveBeenCalledWith("mock-image-ref", mockFile);
            expect(getDownloadURL).toHaveBeenCalledWith("mock-image-ref");
        });
    });
});