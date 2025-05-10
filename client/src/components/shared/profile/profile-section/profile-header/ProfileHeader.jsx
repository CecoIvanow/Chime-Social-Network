import ProfileAvatar from "./profile-avatar/ProfileAvatar";
import ProfileInfo from "./profile-info/ProfileInfo";

export default function ProfileHeader({
    userData,
}) {
    return <>
        <div className="profile-header">
            <ProfileAvatar
                userData={userData}
            />

            <ProfileInfo
                userData={userData}
            />
        </div>
    </>
}