import { Link } from "react-router";
import { useEffect, useState } from "react";

import postServices from "../services/post-services";

export default function PostItem({
    postMetaData,
    creatorDetails,
    userId,
    setTotalPosts,
    totalPosts,
}) {

    const [isLiked, setIsLiked] = useState(false);

    const onDeletePostClickHandler = async () => {
        const isDeleteCondirmed = confirm('Are you sure you want to delete this post?');

        if (!isDeleteCondirmed) {
            return totalPosts; // Returns totalPosts unnecessarily because eslint marks it as not used!
        }

        const deletedPostId = await postServices.handleDelete(postMetaData.id);

        setTotalPosts(totalPosts => totalPosts.filter(post => post._id !== deletedPostId))
    }

    const onLikePostClickHandler = async () => {
        await postServices.handleLike(userId, postMetaData.id);
        postMetaData.likes.push(userId);
        setIsLiked(true);
    }

    const onUnlikePostClockHandler = async () => {
        await postServices.handleUnlike(userId, postMetaData.id);
        postMetaData.likes = postMetaData.likes.filter(userLike => userLike !== userId);
        setIsLiked(false);
    }

    useEffect(() => {
        if (postMetaData?.likes.includes(userId)) {
            setIsLiked(true);
        }
    }, [postMetaData?.likes, userId])

    return <>
        <li className='post-item'>
            <div className='post-header'>
                <div>
                    <img className='owner-picture' src={creatorDetails?.imageUrl} alt="" />
                    <p className='post-owner'><Link to={`/profile/${creatorDetails?.id}`}>{creatorDetails?.fullName}</Link></p>
                </div>
                <div className='created-on'>Posted on {postMetaData?.postedOn}</div>
            </div>
            <div className='post-text'>{postMetaData?.text}</div>
            <div className="post-interactions">
                <div className="likes">Likes: {postMetaData?.likes.length}</div>
                <div className="comments">Comments: {postMetaData?.comments.length}</div>
            </div>
            <div className='button-div'>
                <div>
                    {(userId && userId !== creatorDetails?.id) && (
                        (!isLiked &&
                            <button className='button' type="button" onClick={onLikePostClickHandler}>Like</button>)
                        ||
                        (isLiked &&
                            <button className='button unlike-btn' type="button" onClick={onUnlikePostClockHandler}>Unlike</button>)
                    )}
                </div>
                <div className='owner-buttons'>
                    {userId === creatorDetails?.id && (
                        <>
                            <button className='button' type="button">Edit</button>
                            <button className='button delete-btn' type="button" onClick={onDeletePostClickHandler}>Delete</button>
                        </>
                    )}
                </div>
            </div>
        </li >
    </>
}