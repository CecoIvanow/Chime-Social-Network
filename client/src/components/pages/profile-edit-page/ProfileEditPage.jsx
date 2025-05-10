import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

import { storage } from "../../../firebase/firebase-storage/config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

import GenderDetails from "../../shared/user-details/gender-details/GenderDetails"
import SectionHeading from "../../ui/headings/SectionHeading"
import ImageUpload from "./image-upload/ImageUpload"
import ProfileBioTextarea from "./profile-bio-textarea/ProfileBioTextarea"
import ProfileEditButtons from "./profile-edit-buttons/ProfileEditButtons"
import InputFieldsList from "../../shared/input-fields/input-fields-list/InputFieldsList"

import { AlertContext } from "../../../contexts/alert-context"
import { ActionsContext } from "../../../contexts/actions-context"
import { UserContext } from "../../../contexts/user-context"

import useUserServices from "../../../hooks/useUserServices"

export default function ProfileEditPage() {
    const navigateTo = useNavigate();

    const [userData, setUserData] = useState({});
    const [imageUpload, setImageUpload] = useState(null);

    const { setAlert } = useContext(AlertContext);
    const { isUser: currentUser } = useContext(UserContext)
    const { userId: profileId } = useParams();

    const { updateUser, getUserData, abortAll } = useUserServices();

    const formProfileInputs = [
        { fieldName: 'First name', inputType: 'text', inputName: 'firstName', value: userData?.firstName },
        { fieldName: 'Last name', inputType: 'text', inputName: 'lastName', value: userData?.lastName },
        { fieldName: 'Birthday', inputType: 'date', inputName: 'birthday', value: userData?.birthday },
        { fieldName: 'Location', inputType: 'text', inputName: 'location', value: userData?.location },
        { fieldName: 'Occupation', inputType: 'text', inputName: 'occupation', value: userData?.occupation },
        { fieldName: 'Education', inputType: 'text', inputName: 'education', value: userData?.education },
        { fieldName: 'Status', inputType: 'text', inputName: 'status', value: userData?.status },
    ]

    useEffect(() => {
        if (currentUser !== profileId) {
            navigateTo('/404');
        }

        getUserData(profileId)
            .then(data => setUserData(data))
            .catch(error => {
                console.error(error);
                setAlert(error.message);
            });

        return () => {
            abortAll();
        }
    }, [profileId, currentUser, navigateTo, setAlert, getUserData, abortAll]);

    const onEditSubmitClickHandler = async (formData) => {
        const data = Object.fromEntries(formData);

        if (imageUpload) {
            data.imageUrl = await imageUploadToStorage();
        }

        try {
            await updateUser(profileId, data);
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

    const profileEditActionsContextValues = {
        onCancelEditClickHandler
    }

    return <>
        <div className="edit-profile-container">
            <SectionHeading
                sectionName='Edit Profile:'
            />

            <ImageUpload
                imageUrl={userData?.imageUrl}
                setImageUpload={setImageUpload}
            />

            <form action={onEditSubmitClickHandler}>
                <GenderDetails
                    userGender={userData?.gender}
                />

                <InputFieldsList
                    inputFields={formProfileInputs}
                />

                <ProfileBioTextarea
                    userData={userData}
                />

                <ActionsContext.Provider value={profileEditActionsContextValues}>
                    <ProfileEditButtons />
                </ActionsContext.Provider>
            </form>
        </div>
    </>
}