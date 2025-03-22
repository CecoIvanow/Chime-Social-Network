import { Link } from "react-router"

export default function PostHeader({
    post,
}) {
    return <>
        <div className='post-header'>
            <div>
                <img className='owner-picture' src={post.owner.imageUrl} alt="" />
                <p className='post-owner'><Link to={`/profile/${post.owner._id}`}>{`${post.owner.firstName} ${post.owner.lastName}`}</Link></p>
            </div>
            <div className='created-on'><Link to={`/post/${post._id}/details`}>Posted on {post.postedOn}</Link></div>
        </div>
    </>
}