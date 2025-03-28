import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

import userServices from "../../../services/user-services"

import InputField from "../../ui/inputs/input-field/InputField"
import TextAreaInput from "../../ui/inputs/textarea-input-field/TextAreaInput"
import GenderDetails from "../../ui/inputs/gender-details/GenderDetails"
import EditControls from "../../shared/controls/edit-controls/EditControls"
import SectionHeading from "../../ui/headings/SectionHeading"
import ImageUpload from "./image-upload/ImageUpload"

import { storage } from "../../../firebase/firebase-storage/config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function ProfileEditPage() {
    const [userData, setUserData] = useState({});
    const [imageUpload, setImageUpload] = useState(null);

    const { userId } = useParams();
    const navigateTo = useNavigate();

    const formProfileInputs = [
        { fieldName: 'First name', inputType: 'text', inputName: 'firstName', value: userData.firstName },
        { fieldName: 'Last name', inputType: 'text', inputName: 'lastName', value: userData.lastName },
        { fieldName: 'Location', inputType: 'text', inputName: 'location', value: userData.location },
        { fieldName: 'Occupation', inputType: 'text', inputName: 'occupation', value: userData.occupation },
        { fieldName: 'Education', inputType: 'text', inputName: 'education', value: userData.education },
        { fieldName: 'Status', inputType: 'text', inputName: 'status', value: userData.status },
    ]

    useEffect(() => {
        const abortController = new AbortController();
        const abortSignal = abortController.signal;

        userServices.handleGetUserData(userId, abortSignal)
            .then(data => setUserData(data))
            .catch(error => console.error(error));

        return () => abortController.abort();
    }, [userId]);

    const onEditSubmitClickHandler = async (formData) => {
        const data = Object.fromEntries(formData);
        console.log(data);

        if (imageUpload) {
            data.imageUrl = await imageUploadToStorage();
        }

        await userServices.handleUpdateUserData(userId, data);

        navigateTo(`/profile/${userId}`);
    }

    const imageUploadToStorage = async () => {
        const imageRef = ref(storage, `/images/${userId}/avatar`);
        const resp = await uploadBytes(imageRef, imageUpload);
        const imageUrl = getDownloadURL(resp.ref);

        return imageUrl;
    }

    const onCancelEditClickHandler = async (e) => {
        e.preventDefault();

        navigateTo(`/profile/${userId}`);
    }

    return <>
        <div className="edit-profile-container">
            <SectionHeading
                sectionName='Edit Profile:'
            />

            <ImageUpload
                imageUrl={userData.imageUrl}
                setImageUpload={setImageUpload}
            />

            <form action={onEditSubmitClickHandler}>
                <GenderDetails
                    chosenGender={userData.gender}
                />

                {formProfileInputs.map(field =>
                    <InputField
                        key={field.inputName}
                        fieldName={field.fieldName}
                        inputName={field.inputName}
                        inputType={field.inputType}
                        initialValue={field.value}
                    />
                )}

                <TextAreaInput
                    fieldName='Bio'
                    inputName='bio'
                    initialValue={userData.bio}
                />

                <div className='button-div'>
                    <div></div>
                    <div className="owner-buttons">
                        <EditControls
                            onCancelClickHandler={onCancelEditClickHandler}
                        />
                    </div>
                </div>
            </form>
        </div>
    </>
}