import Button from "../../../ui/buttons/button/Button";

export default function EmailChangeForm({
    userEmail,
    onSubmitHandler
}) {
    return <>
        <form action={onSubmitHandler}>
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
    </>
}