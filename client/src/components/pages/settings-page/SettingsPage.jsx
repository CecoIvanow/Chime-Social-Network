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

    const { loggedInUserId } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const { changeUserEmail, changeUserPassword, getUserFields, abortAll } = useUserServices();

    const onEmailChangeSubmitHandler = async (formData) => {
        const data = Object.fromEntries(formData);

        try {
            const isSuccessfull = await changeUserEmail(loggedInUserId, data);

            if (isSuccessfull) {
                navigateTo(`/profile/${loggedInUserId}`);
            }
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const onPasswordChangeSubmitHandler = async (formData) => {
        const data = Object.fromEntries(formData);

        try {
            const isSuccessfull = await changeUserPassword(loggedInUserId, data, {});

            if (isSuccessfull) {
                navigateTo(`/profile/${loggedInUserId}`);
            }
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    useEffect(() => {
        const userFields = 'email';

        getUserFields(loggedInUserId, userFields)
            .then(data => setUserEmail(data?.email))
            .catch(error => {
                console.error(error);
                setAlert(error.message);
            })

        return () => {
            abortAll();
        }
    }, [loggedInUserId, setAlert, getUserFields, abortAll]);

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