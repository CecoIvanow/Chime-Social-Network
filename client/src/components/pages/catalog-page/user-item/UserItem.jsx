import { Link } from 'react-router'
import Button from '../../../ui/button/Button'

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
                <Link to={`/profile/${profileId}`}><div className="user-name">{firstName} {lastName}</div></Link>
                <div className="user-details">
                    <div>Member since: {memberSince}</div>
                    <div>Posts: {postsAmount}</div>
                </div>
            </div>
            {(isUser && isUser !== profileId) && (
                <Button
                    buttonName='Add'
                    btnStyle='button'
                />
            )}
        </div>
    </>
}