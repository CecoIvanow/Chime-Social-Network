import { Link } from "react-router";

export default function PostHeader({
    postId,
    postedOn,
    imageUrl,
    ownerId,
    ownerFullName,
}) {
    return <>
        <div className='post-header'>
            <div>
                <img className='owner-picture' src={imageUrl} alt="" />
                <p className='post-owner'><Link to={`/profile/${ownerId}`}>{ownerFullName}</Link></p>
            </div>
            <div className='created-on'><Link to={`/post/${postId}/details`}>Posted on {postedOn}</Link></div>
        </div>
    </>
}