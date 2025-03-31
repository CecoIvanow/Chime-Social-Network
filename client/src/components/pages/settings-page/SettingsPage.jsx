import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router'


import userServices from "../../../services/user-services";
import PasswordChangeForm from "./password-change-form/PasswordChangeForm";
import EmailChangeForm from "./email-change-form/EmailChangeForm";

import { UserContext } from "../../../contexts/user-context";
import { AlertContext } from "../../../contexts/alert-context";

export default function SettingsPage() {
    const navigateTo = useNavigate();

    const [userEmail, setUserEmail] = useState('');

    const { isUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const onEmailChangeSubmitHandler = async (formData) => {
        const data = Object.fromEntries(formData);

        try {
            await userServices.handleEmailChange(isUser, data, {});
        } catch (error) {
            console.error(error);
            setAlert(error.message);
            return;
        }

        navigateTo(`/profile/${isUser}`);
    }

    const onPasswordChangeSubmitHandler = async (formData) => {
        const data = Object.fromEntries(formData);

        try {
            await userServices.handlePasswordChange(isUser, data, {});
        } catch (error) {
            console.error(error);
            setAlert(error.message);
            return;
        }

        navigateTo(`/profile/${isUser}`);
    }

    useEffect(() => {
        const userFields = 'email';

        const abortController = new AbortController();
        const abortSignal = abortController.signal;

        userServices.handleGetUserFields(isUser, userFields, { abortSignal })
            .then(data => setUserEmail(data.email))
            .catch(error => {
                console.error(error);
                setAlert(error.message);
            })

        return () => {
            abortController.abort();
        }
    }, [isUser, setAlert]);

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