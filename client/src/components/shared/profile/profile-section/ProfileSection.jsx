import LoadingSpinner from "../../../ui/loading-spinner/LoadingSpinner";
import ProfileHeader from "./profile-header/ProfileHeader";

export default function ProfileSection({
    userData,
    isLoading,
}) {
    return <>
        <div className="profile-info-section">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <ProfileHeader
                    userData={userData}
                />
            )}
        </div>
    </>
}