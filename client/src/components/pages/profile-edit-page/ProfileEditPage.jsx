import { useEffect, useState } from "react"
import { useParams } from "react-router"

import userServices from "../../../services/user-services"

import SettingsInputFormGroup from "../../shared/settings/SettingsInputFormGroup"
import TextAreaInput from "../../ui/input-forms/text-area-input/TextAreaInput"
import GenderDetails from "../register-page/gender-details/GenderDetails"
import EditControls from "../../shared/controls/edit-controls/EditControls"

export default function ProfileEditPage() {
    const [userData, setUserData] = useState({});

    const { userId } = useParams();

    const formProfileInputs = [
        { fieldName: 'First name', inputType: 'text', inputName: 'firstName', value: userData.firstName },
        { fieldName: 'Last name', inputType: 'text', inputName: 'lastName', value: userData.lastName },
        { fieldName: 'Location:', inputType: 'text', inputName: 'location', value: userData.location },
        { fieldName: 'Occupation:', inputType: 'text', inputName: 'occupation', value: userData.occupation },
        { fieldName: 'Education:', inputType: 'text', inputName: 'education', value: userData.education },
        { fieldName: 'Status:', inputType: 'text', inputName: 'status', value: userData.status },
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
    }

    return <>
        <div className="edit-profile-container">
            <div className="profile-header">
                <div className="avatar-section">
                    <img src={userData.imageUrl} className="profile-avatar" alt="Profile picture" />
                    <label className="avatar-upload">
                        📷
                        <input type="file" accept="image/*" />
                    </label>
                </div>
                <h1>Edit Profile</h1>
            </div>

            <form action={onEditSubmitClickHandler}>
                <GenderDetails
                    chosenGender={userData.gender}
                />

                {formProfileInputs.map(field =>
                    <SettingsInputFormGroup
                        key={field.inputName}
                        fieldName={field.fieldName}
                        inputName={field.inputName}
                        inputType={field.inputType}
                        value={field.value}
                    />
                )}
                
                <TextAreaInput
                    fieldName='Bio'
                />

                <div className='button-div'>
                    <div></div>
                    <div className='owner-buttons'>
                        <EditControls />
                    </div>
                </div>
            </form>
        </div>
    </>
}