import { Link } from "react-router";
import { useEffect, useState } from "react";

import postServices from "../services/post-services";

export default function PostItem({
    postId,
    ownerId,
    userId,
    text,
    postedOn,
    imageUrl,
    fullName,
    setTotalPosts,
    totalPosts,
    likes,
    comments
}) {

    const [isLiked, setIsLiked] = useState(false);

    const onDeletePostClickHandler = async () => {
        const isDeleteCondirmed = confirm('Are you sure you want to delete this post?');

        if (!isDeleteCondirmed) {
            return totalPosts; // Returns totalPosts unnecessarily because eslint marks it as not used!
        }

        const deletedPostId = await postServices.handleDelete(postId);

        setTotalPosts(totalPosts => totalPosts.filter(post => post._id !== deletedPostId))
    }

    const onLikePostClickHandler = async () => {
        await postServices.handleLike(userId, postId);
        likes.push(userId);
        setIsLiked(true);
    }

    useEffect(() => {
        if (likes?.includes(userId)) {
            setIsLiked(true);
        }
    }, [likes, userId])

    return <>
        <li className='post-item'>
            <div className='post-header'>
                <div>
                    <img className='owner-picture' src={imageUrl} alt="" />
                    <p className='post-owner'><Link to={`/profile/${ownerId}`}>{fullName}</Link></p>
                </div>
                <div className='created-on'>Posted on {postedOn}</div>
            </div>
            <div className='post-text'>{text}</div>
            <div className="post-interactions">
                <div className="likes">Likes: {likes?.length}</div>
                <div className="comments">Comments: {comments?.length}</div>
            </div>
            <div className='post-buttons-div'>
                <div>
                    {((userId && userId !== ownerId) && !isLiked) && (
                        <button className='post-buttons like-btn' type="button" onClick={onLikePostClickHandler}>Like</button>
                    )}
                </div>
                <div className='owner-buttons'>
                    {userId === ownerId && (
                        <>
                            <button className='post-buttons edit-btn' type="button">Edit</button>
                            <button className='post-buttons delete-btn' type="button" onClick={onDeletePostClickHandler}>Delete</button>
                        </>
                    )}
                </div>
            </div>
        </li>
    </>
}