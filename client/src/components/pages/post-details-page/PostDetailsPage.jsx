import { Link, useLocation, useNavigate } from "react-router"
import { useEffect, useState } from "react";

import CommentItem from "./comment-item/CommentItem"
import postServices from "../../../services/post-services";
import commentServices from "../../../services/comment-services";

export default function PostDetailsPage({
    isUser
}) {
    const location = useLocation();
    const navigateTo = useNavigate();

    const [postData, setPostData] = useState({});
    const [isLiked, setIsLiked] = useState(false);

    const onDeletePostClickHandler = async () => {
        const isDeleteConfirmed = confirm('Are you sure you want to delete this post?');

        if (!isDeleteConfirmed) {
            return;
        }

        await postServices.handleDelete(postData._id);
        navigateTo('/catalog');
    }

    const onLikePostClickHandler = async () => {
        await postServices.handleLike(isUser, postData._id);
        postData.likes.push(isUser);
        setIsLiked(true);
    }

    const onUnlikePostClockHandler = async () => {
        await postServices.handleUnlike(isUser, postData._id);
        postData.likes = postData.likes.filter(userLike => userLike !== isUser);
        setIsLiked(false);
    }

    const onAddCommentSubmitHandler = async (formData) => {
        const commentData = Object.fromEntries(formData);
        commentData.onPost = location.pathname.split('/').at(2);
        commentData.owner = isUser;

        const newComment = await commentServices.create(commentData);
        postData.comments.unshift(newComment);
        setPostData({ ...postData });
    }

    useEffect(() => {
        const postId = location.pathname.split('/').at(2);

        const abortController = new AbortController();
        const abortSignal = abortController.signal;

        postServices.handleGetPostDataWithComments(postId, abortSignal)
            .then(data => {
                setPostData(data);

                if (data.likes.includes(isUser)) {
                    setIsLiked(true);
                }
            })
            .catch(error => console.error(error.message));

        return () => {
            abortController.abort();
        }

    }, [location.pathname, isUser]);

    return <>
        <li className='post-page-body'>
            <div className='post-page-header'>
                <div>
                    <img className='owner-picture' src={postData.owner?.imageUrl} alt="" />
                    <p className='post-owner'><Link to={`/profile/${postData.owner?._id}`}>{postData.owner?.firstName} {postData.owner?.lastName}</Link></p>
                </div>
                <div className='created-on'>Posted on {postData?.postedOn}</div>
            </div>
            <div className='post-page-text'>{postData?.text}</div>
            <div className="post-interactions">
                <div className="likes">Likes: {postData.likes?.length}</div>
                <div className="comments">Comments: {postData.comments?.length}</div>
            </div>
            <div className='button-div'>
                <div>
                    {(isUser && isUser !== postData.owner?._id) && (
                        <>
                            {(isLiked ? (
                                <button className='button unlike-btn' type="button" onClick={onUnlikePostClockHandler}>Unlike</button>
                            ) : (
                                <button className='button' type="button" onClick={onLikePostClickHandler}>Like</button>
                            ))}
                        </>
                    )}
                </div>
                <div className='owner-buttons'>
                    {isUser === postData.owner?._id && (
                        <>
                            <button className='button' type="button"><Link to={`/post/${postData?._id}/edit`}>Edit</Link></button>
                            <button className='button delete-btn' type="button" onClick={onDeletePostClickHandler}>Delete</button>
                        </>
                    )}
                </div>
            </div>
            <div className="comments-section">
                {isUser && (
                    <form action={onAddCommentSubmitHandler}>
                        <div className='comment-create'>
                            <label htmlFor="comment"></label>
                            <input type="text" name="text" id="comment" placeholder="Add your comment..." />
                        </div>
                        <button className='button comment-btn'>Comment</button>
                    </form>
                )}
                <div className="post-comments">
                    <p>All Comments:</p>
                    <ul>
                        {postData.comments?.map(comment => {
                            const metaData = {
                                id: comment._id,
                                text: comment.text,
                                postedOn: comment.postedOn
                            }

                            const creatorData = {
                                id: comment.owner._id,
                                firstName: comment.owner.firstName,
                                lastName: comment.owner.lastName,
                                imageUrl: comment.owner.imageUrl,
                            }

                            return <CommentItem
                                key={comment._id}
                                isUser={isUser}
                                metaData={metaData}
                                creatorData={creatorData}
                                postData={postData}
                                setPostData={setPostData}
                            />
                        })}
                    </ul>
                </div>
            </div>
        </li >
    </>
}