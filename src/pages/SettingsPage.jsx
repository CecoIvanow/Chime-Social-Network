import MenuBar from "../components/MenuBar"

export default function SettingsPage() {
    return <>
        <MenuBar />

        <div className="settings-container">
            <form encType="">
                <div className="settings-card">
                    <h2 className="settings-heading">Profile Information</h2>

                    <div className="avatar-section">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" className="profile-avatar" alt="Profile picture" />
                        <div className="avatar-upload">
                            <input type="file" id="avatar-upload" className="file-input" />
                            <label htmlFor="avatar-upload" className="custom-file-input">Change Avatar</label>
                            <span className="form-label">Recommended size: 400x400 pixels</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-input" value="John Doe" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" value="john.doe@example.com" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea className="form-input bio-input">Web developer passionate about creating user-friendly applications. Based in New York.</textarea>
                    </div>

                    <button className="save-button">Save Changes</button>
                </div>
            </form>

            <form>
                <div className="settings-card password-section">
                    <h2 className="settings-heading">Account Security</h2>

                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input type="password" className="form-input" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input type="password" className="form-input" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <input type="password" className="form-input" />
                    </div>

                    <button className="save-button">Update Password</button>
                </div>
            </form>
        </div>
    </>
}