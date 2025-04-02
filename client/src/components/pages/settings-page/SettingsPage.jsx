import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router'

import PasswordChangeForm from "./password-change-form/PasswordChangeForm";
import EmailChangeForm from "./email-change-form/EmailChangeForm";

import { UserContext } from "../../../contexts/user-context";
import { AlertContext } from "../../../contexts/alert-context";

import useUserServices from "../../../hooks/useUserServices";

export default function SettingsPage() {
    const navigateTo = useNavigate();

    const [userEmail, setUserEmail] = useState('');

    const { isUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const { getUserFields } = useUserServices();

    const { changeUserEmail, changeUserPassword } = useUserServices();

    const onEmailChangeSubmitHandler = async (formData) => {
        const data = Object.fromEntries(formData);

        try {
            const isSuccessfull = await changeUserEmail(isUser, data);

            if (isSuccessfull) {
                navigateTo(`/profile/${isUser}`);
            }
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const onPasswordChangeSubmitHandler = async (formData) => {
        const data = Object.fromEntries(formData);

        try {
            const isSuccessfull = await changeUserPassword(isUser, data, {});

            if (isSuccessfull) {
                navigateTo(`/profile/${isUser}`);
            }
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    useEffect(() => {
        const userFields = 'email';

        getUserFields(isUser, userFields)
            .then(data => setUserEmail(data.email))
            .catch(error => {
                console.error(error);
                setAlert(error.message);
            })
    }, [isUser, setAlert, getUserFields]);

    return <>
        <div className="settings-container">
            <EmailChangeForm
                userEmail={userEmail}
                onSubmitHandler={onEmailChangeSubmitHandler}
            />

            <PasswordChangeForm
                onSubmitHandler={onPasswordChangeSubmitHandler}
            />

        </div>
    </>
}