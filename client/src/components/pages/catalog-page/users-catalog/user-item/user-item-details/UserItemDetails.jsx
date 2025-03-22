import { Link } from 'react-router'

export default function UserItemDetails({
    user,
}) {
    return <>
        <img src={user.imageUrl} className="user-avatar" alt="User avatar" />
        <div className="user-info">
            <Link to={`/profile/${user._id}`}><div className="user-name">{user.firstName} {user.lastName}</div></Link>
            <div className="user-details">
                <div>Member since: {user.memberSince}</div>
                <div>Posts: {user.createdPosts.length}</div>
            </div>
        </div>
    </>
}