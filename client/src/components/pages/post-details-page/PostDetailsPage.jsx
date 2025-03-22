import { useLocation, useNavigate } from "react-router"
import { useEffect, useState } from "react";

import postServices from "../../../services/post-services";

import CommentItem from "./comment-item/CommentItem"
import CommentCreateForm from "./comment-create-form/CommentCreateForm";
import OwnerControls from "../../shared/controls/owner-controls/OwnerControls";
import EditControls from "../../shared/controls/edit-controls/EditControls";
import PostInteractionButtons from "../../shared/post/post-interaction-buttons/PostInteractionButtons";
import PostInteractions from "../../shared/post/post-item/post-interactions/PostInteractions";
import PostHeader from "../../shared/post/post-header/PostHeader";

export default function PostDetailsPage({
    isUser,
    shouldEdit
}) {
    const location = useLocation();
    const navigateTo = useNavigate();

    const [postData, setPostData] = useState({});
    const [isLiked, setIsLiked] = useState(false);
    const [isEditClicked, setIsEditClicked] = useState(shouldEdit);
    const [postText, setPostText] = useState('');

    useEffect(() => {
        const postId = location.pathname.split('/').at(2);

        const abortController = new AbortController();
        const abortSignal = abortController.signal;

        postServices.handleGetPostDataWithComments(postId, abortSignal)
            .then(data => {
                setPostData(data);
                setPostText(data.text);

                if (data.likes.includes(isUser)) {
                    setIsLiked(true);
                }
            })
            .catch(error => console.error(error.message));

        return () => {
            abortController.abort();
        }

    }, [location.pathname, isUser]);

    if (!postData?._id) {
        return null;
    }

    const textChangeHandler = (e) => {
        setPostText(e.currentTarget.value);
    }

    const onCancelEditClickHandler = () => {
        setPostText(postData.text);
        setIsEditClicked(false);
    }

    const onSaveEditClickHandler = async () => {
        await postServices.handlePostUpdate(postData._id, postText);
        setIsEditClicked(false);
    }

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

    const onEditPostClickHandler = async () => {
        setIsEditClicked(true);
    }

    return <>
        <li className='post-page-body'>

            <PostHeader
                post={postData}
            />

            {isEditClicked ? (
                <div className="edit-content">
                    <textarea className="edit-textarea" value={postText} onChange={textChangeHandler} placeholder="Edit your post content..."></textarea>
                </div>
            ) : (
                <div className='post-text'>{postText}</div>
            )}

            <PostInteractions
                comments={postData.comments}
                likes={postData.likes}
            />

            <div className='button-div'>
                <div>
                    {(isUser && isUser !== postData.owner._id) && (
                        <PostInteractionButtons
                            isLiked={isLiked}
                            onLikeClickHandler={onLikePostClickHandler}
                            onUnlikeClickHandler={onUnlikePostClockHandler}
                        />
                    )}
                </div>
                <div className='owner-buttons'>
                    {(isUser && isUser === postData.owner._id) && (
                        <>
                            {isEditClicked ? (
                                <EditControls
                                    onSaveClickHandler={onSaveEditClickHandler}
                                    onCancelClickHandler={onCancelEditClickHandler}
                                />
                            ) : (
                                <OwnerControls
                                    onEditClickHandler={onEditPostClickHandler}
                                    onDeleteClickHandler={onDeletePostClickHandler}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="comments-section">
                {isUser && (
                    <CommentCreateForm
                        userId={isUser}
                        postData={postData}
                        setPostData={setPostData}
                    />
                )}
                <div className="post-comments">
                    <p>All Comments:</p>
                    <ul>
                        {postData.comments.map(comment =>
                            <CommentItem
                                key={comment._id}
                                isUser={isUser}
                                comment={comment}
                                postData={postData}
                                setPostData={setPostData}
                            />
                        )}
                    </ul>
                </div>
            </div>
        </li >
    </>
}