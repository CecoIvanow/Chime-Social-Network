export default function ProfileAvatar({
    userData
}) {
    return <>
        <img src={userData?.imageUrl} className="profile-avatar" alt="Profile picture" />
    </>
}