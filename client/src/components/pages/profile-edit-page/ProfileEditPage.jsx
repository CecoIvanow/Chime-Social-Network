import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

import { UserContext } from "../../../contexts/user-context"

import userServices from "../../../services/user-services"

import InputField from "../../ui/inputs/input-field/InputField"
import TextAreaInput from "../../ui/inputs/textarea-input-field/TextAreaInput"
import GenderDetails from "../../ui/inputs/gender-details/GenderDetails"
import EditControls from "../../shared/controls/edit-controls/EditControls"
import SectionHeading from "../../ui/headings/SectionHeading"
import ImageUpload from "./image-upload/ImageUpload"

import { storage } from "../../../firebase/firebase-storage/config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { AlertContext } from "../../../contexts/alert-context"

export default function ProfileEditPage() {
    const [userData, setUserData] = useState({});
    const [imageUpload, setImageUpload] = useState(null);

    const navigateTo = useNavigate();
    const { userId: profileId } = useParams();
    const { isUser: currentUser } = useContext(UserContext)
    const { setAlert } = useContext(AlertContext);

    const formProfileInputs = [
        { fieldName: 'First name', inputType: 'text', inputName: 'firstName', value: userData.firstName },
        { fieldName: 'Last name', inputType: 'text', inputName: 'lastName', value: userData.lastName },
        { fieldName: 'Birthday', inputType: 'date', inputName: 'birthday', value: userData.birthday },
        { fieldName: 'Location', inputType: 'text', inputName: 'location', value: userData.location },
        { fieldName: 'Occupation', inputType: 'text', inputName: 'occupation', value: userData.occupation },
        { fieldName: 'Education', inputType: 'text', inputName: 'education', value: userData.education },
        { fieldName: 'Status', inputType: 'text', inputName: 'status', value: userData.status },
    ]

    useEffect(() => {
        if (currentUser !== profileId) {
            navigateTo('/404');
        }

        const abortController = new AbortController();
        const abortSignal = abortController.signal;

        userServices.handleGetUserData(profileId, abortSignal)
            .then(data => setUserData(data))
            .catch(error => {
                console.error(error);
                setAlert(error.message);
            });

        return () => abortController.abort();
    }, [profileId, currentUser, navigateTo, setAlert]);

    const onEditSubmitClickHandler = async (formData) => {
        const data = Object.fromEntries(formData);

        if (imageUpload) {
            data.imageUrl = await imageUploadToStorage();
        }

        try {
            await userServices.handleUpdateUserData(profileId, data);
        } catch (error) {
            console.error(error);
            setAlert(error.message);
            return;
        }

        navigateTo(`/profile/${profileId}`);
    }

    const imageUploadToStorage = async () => {
        const imageRef = ref(storage, `/images/${profileId}/avatar`);
        const resp = await uploadBytes(imageRef, imageUpload);
        const imageUrl = await getDownloadURL(resp.ref);

        return imageUrl;
    }

    const onCancelEditClickHandler = async (e) => {
        e.preventDefault();

        navigateTo(`/profile/${profileId}`);
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
                    userGender={userData.gender}
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