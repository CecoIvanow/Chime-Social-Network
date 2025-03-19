import { useEffect, useState } from "react"
import { useNavigate } from 'react-router'


import userServices from "../../../services/user-services";
import Button from "../../ui/button/Button";

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
            <form onSubmit={onEmailChangeSubmitHandler}>
                <div className="settings-card password-section">
                    <h2 className="settings-heading">Account Email - {userEmail}</h2>

                    <div className="form-group">
                        <label className="form-label">Current Email</label>
                        <input type="text" className="form-input" name="curEmail" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Email</label>
                        <input type="text" className="form-input" name="newEmail" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input type="password" className="form-input" name="curPass" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Repeat Password</label>
                        <input type="password" className="form-input" name="rePass" />
                    </div>

                    <Button
                        btnStyle="save-button"
                        buttonName="Change Email"
                    />
                </div>
            </form>

            <form onSubmit={onPasswordChangeSubmitHandler}>
                <div className="settings-card password-section">
                    <h2 className="settings-heading">Account Password - ******</h2>

                    <div className="form-group">
                        <label className="form-label">Current Email</label>
                        <input type="text" className="form-input" name="curEmail" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input type="password" className="form-input" name="curPass" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input type="password" className="form-input" name="newPass" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Repeat New Password</label>
                        <input type="password" className="form-input" name="rePass" />
                    </div>

                    <Button
                        btnStyle="save-button"
                        buttonName="Change Password"
                    />
                </div>
            </form>
        </div>
    </>
}