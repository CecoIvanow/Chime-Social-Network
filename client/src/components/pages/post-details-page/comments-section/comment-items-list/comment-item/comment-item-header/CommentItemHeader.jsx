import { Link } from "react-router";

export default function CommentItemHeader({
    comment
}) {
    return <div className='comment-header'>
        <div>
            <img className='owner-picture' src={comment.owner.imageUrl} />
            <p className='post-owner'>
                <Link to={`/profile/${comment.owner._id}`}>
                    {comment.owner.firstName} {comment.owner.lastName}
                </Link>
            </p>
        </div>
        <div className='commented-on'>Posted on {comment.postedOn}</div>
    </div>
}