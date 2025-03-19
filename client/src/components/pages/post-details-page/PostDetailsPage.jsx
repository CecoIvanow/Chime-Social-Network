import { Link, useLocation, useNavigate } from "react-router"
import { useEffect, useState } from "react";

import CommentItem from "./comment-item/CommentItem"
import postServices from "../../../services/post-services";
import CreateCommentField from "./create-comment-field/CreateCommentField";
import OwnerControls from "../../shared/owner-controls/OwnerControls";
import EditControls from "../../shared/edit-controls/EditControls";
import Button from "../../ui/button/Button";

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

    const textChangeHandler = (e) => {
        setPostText(e.currentTarget.value);
    }

    const onCancelEditClickHandler = () => {
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

    return <>
        <li className='post-page-body'>
            <div className='post-page-header'>
                <div>
                    <img className='owner-picture' src={postData.owner?.imageUrl} alt="" />
                    <p className='post-owner'><Link to={`/profile/${postData.owner?._id}`}>{postData.owner?.firstName} {postData.owner?.lastName}</Link></p>
                </div>
                <div className='created-on'>Posted on {postData?.postedOn}</div>
            </div>

            {isEditClicked ? (
                <div className="edit-content">
                    <textarea className="edit-textarea" value={postText} onChange={textChangeHandler} placeholder="Edit your post content..."></textarea>
                </div>
            ) : (
                <div className='post-page-text'>{postText}</div>
            )}

            <div className="post-interactions">
                <div className="likes">Likes: {postData.likes?.length}</div>
                <div className="comments">Comments: {postData.comments?.length}</div>
            </div>
            <div className='button-div'>
                <div>
                    {(isUser && isUser !== postData.owner?._id) && (
                        <>
                            {(isLiked ? (
                                <Button
                                    onClickHandler={onUnlikePostClockHandler}
                                    btnStyle="button unlike-btn"
                                    buttonName="Unlike"
                                />
                            ) : (
                                <Button
                                    onClickHandler={onLikePostClickHandler}
                                    btnStyle="button "
                                    buttonName="Like"
                                />
                            ))}
                        </>
                    )}
                </div>
                <div className='owner-buttons'>
                    {(isUser && isUser === postData.owner?._id) && (
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
                    <CreateCommentField
                        userId={isUser}
                        postData={postData}
                        setPostData={setPostData}
                    />
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