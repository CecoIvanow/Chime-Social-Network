export default function UserItem({
    profileId,
    isUser,
    imageUrl,
    postsAmount,
    memberSince,
    firstName,
    lastName,
}) {
    return <>
        <div className="user-item">
            <img src={imageUrl} className="user-avatar" alt="User avatar" />
            <div className="user-info">
                <div className="user-name">{firstName} {lastName}</div>
                <div className="user-details">
                    <div>Member since: {memberSince}</div>
                    <div>Posts: {postsAmount}</div>
                </div>
            </div>
            {(isUser && profileId !== isUser) && (
                <button className="action-button">Add</button>
            )}
        </div>
    </>
}