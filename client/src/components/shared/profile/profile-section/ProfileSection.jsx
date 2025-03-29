import { useContext } from "react";

import LinkButton from "../../../ui/buttons/link-button/LinkButton";
import ProfileInfoLabel from "../profile-info-header/ProfileInfoLabel";

import { UserContext } from "../../../../contexts/user-context";

export default function ProfileDataSection({
    userData,
}) {
    const profileLabels = [
        { labelText: 'Bio:', labelKey: 'bio' },
        { labelText: 'Age:', labelKey: 'age' },
        { labelText: 'Gender:', labelKey: 'gender' },
        { labelText: 'Location:', labelKey: 'location' },
        { labelText: 'Occupation:', labelKey: 'occupation' },
        { labelText: 'Education:', labelKey: 'education' },
        { labelText: 'Status:', labelKey: 'status' },
        { labelText: 'Member Since:', labelKey: 'memberSince' },
    ]

    const { isUser } = useContext(UserContext);

    return <>
        <div className="profile-info-section">
            <div className="profile-header">
                <img src={userData.imageUrl} className="profile-avatar" alt="Profile picture" />
                <div className="profile-info">
                    <h2>{(userData.firstName)} {(userData.lastName)}</h2>

                    {profileLabels.map(label =>
                        <ProfileInfoLabel
                            key={label.labelText}
                            labelKey={label.labelKey}
                            labelText={label.labelText}
                            userData={userData}
                        />
                    )}

                    {isUser && (
                        <LinkButton
                            urlLink={`/profile/${isUser}/edit`}
                            btnStyle="edit-profile-btn"
                            buttonName="Edit Profile"
                        />
                    )}
                </div>
            </div>
        </div>
    </>
}