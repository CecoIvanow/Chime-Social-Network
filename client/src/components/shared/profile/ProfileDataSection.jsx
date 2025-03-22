import LinkButton from "../../ui/buttons/link-button/LinkButton";

export default function ProfileDataSection({
    isUser,
    userData,
}) {
    return <>
        <div className="profile-info-section">
            <div className="profile-header">
                <img src={userData.imageUrl} className="profile-avatar" alt="Profile picture" />
                <div className="profile-info">
                    <h2>{(userData.firstName)} {(userData.lastName)}</h2>
                    <p><span className="info-label">Bio:</span> {userData.bio ? userData.bio : 'N\\A'}</p>
                    <p><span className="info-label">Age:</span> {userData.age || userData.age === 0 ? userData.age : 'N\\A'}</p>
                    <p><span className="info-label">Gender:</span> {userData.gender ? userData.gender : 'N\\A'}</p>
                    <p><span className="info-label">Location:</span> {userData.location ? userData.location : 'N\\A'}</p>
                    <p><span className="info-label">Occupation:</span> {userData.occupation ? userData.occupation : 'N\\A'}</p>
                    <p><span className="info-label">Education:</span> {userData.education ? userData.education : 'N\\A'}</p>
                    <p><span className="info-label">Status:</span> {userData.status ? userData.status : 'N\\A'}</p>
                    <p><span className="info-label">Member Since:</span> {userData.memberSince ? userData.memberSince : 'N\\A'}</p>

                    {isUser && (
                        <LinkButton
                            urlLink={'/edit'}
                            btnStyle="edit-profile-btn"
                            buttonName="Edit Profile"
                        />
                    )}
                </div>
            </div>
        </div>
    </>
}