import MenuBar from "../components/MenuBar"

export default function SettingsPage() {
    return <>
        <MenuBar />

        

        <div className="settings-container">
            <form>
                <div className="settings-card password-section">
                    <h2 className="settings-heading">Account Email</h2>

                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input type="text" className="form-input" name="currentPassword" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Current Email</label>
                        <input type="text" className="form-input" name="currentEmail"/>
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Email</label>
                        <input type="text" className="form-input" name="newEmail" />
                    </div>

                    <button className="save-button">Update Email</button>
                </div>
            </form>

            <form>
                <div className="settings-card password-section">
                    <h2 className="settings-heading">Account Password</h2>

                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input type="password" className="form-input" name="currentPassword" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input type="password" className="form-input" name="newPassword" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input type="password" className="form-input" name="rePassword" />
                    </div>

                    <button className="save-button">Update Password</button>
                </div>
            </form>
        </div>
    </>
}