import ProfileFullname from "./profile-fullname/ProfileFullname";

import EditProfileButton from "./edit-profile-button/EditProfileButton";
import ProfileInfoLabelsList from "./profile-info-labels-list/ProfileInfoLabelsList";

export default function ProfileInfo({
    userData
}) {
    return <>
        <div className="profile-info">
            <ProfileFullname
                userData={userData}
            />

            <ProfileInfoLabelsList
                userData={userData}
            />

            <EditProfileButton />
        </div>
    </>
}