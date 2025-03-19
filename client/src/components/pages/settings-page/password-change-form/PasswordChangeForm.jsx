import Button from "../../../ui/buttons/button/Button";


export default function PasswordChangeForm({
    onSubmitHandler
}) {
    return <>
        <form onSubmit={onSubmitHandler}>
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
    </>
}