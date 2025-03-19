import { useEffect, useState } from "react"
import { useNavigate } from 'react-router'


import userServices from "../../../services/user-services";
.0
import PasswordChangeForm from "./password-change-form/PasswordChangeForm";
import EmailChangeForm from "./email-change-form/EmailChangeForm";

export default function SettingsPage({
    userId
}) {

    const [userEmail, setUserEmail] = useState('');

    const navigateTo = useNavigate();

    const onEmailChangeSubmitHandler = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        await userServices.handleEmailChange(userId, data);

        navigateTo(`/profile/${userId}`);
    }

    const onPasswordChangeSubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        await userServices.handlePasswordChange(userId, data);

        navigateTo(`/profile/${userId}`);
    }

    useEffect(() => {
        const userFields = 'email';

        const abortController = new AbortController();
        const abortSignal = abortController.signal;

        userServices.handleGetUserFields(userId, userFields, abortSignal)
            .then(data => setUserEmail(data.email))
            .catch(error => console.error(error.message))

        return () => {
            abortController.abort();
        }
    }, [userId]);

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