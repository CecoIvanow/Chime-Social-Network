import { Link } from "react-router"
import { useEffect, useState } from "react";

import commentServices from "../../../../services/comment-services"

import OwnerControls from "../../../shared/controls/owner-controls/OwnerControls";
import EditControls from "../../../shared/controls/edit-controls/EditControls";

export default function CommentItem({
    isUser,
    comment,
    postData,
    setPostData,
}) {

    const [isEditClicked, setIsEditClicked] = useState(false);
    const [commentText, setCommentText] = useState('');

    const onDeleteCommentClickHandler = async () => {
        const isConfirmed = confirm('Are you sure you want to delete this comment?');

        if (!isConfirmed) {
            return;
        }

        const removedCommentId = await commentServices.handleDelete(comment._id);

        postData.comments = postData.comments.filter(comment => comment._id !== removedCommentId);
        setPostData({ ...postData });
    }

    const onEditCommentClickHandler = async () => {
        setIsEditClicked(true);
    }

    const onTextChangeHandler = (e) => {
        setCommentText(e.currentTarget.value);
    }

    const onSaveEditHandler = async () => {

        await commentServices.handleUpdate(comment._id, commentText);

        setIsEditClicked(false);
    }

    const onCancelEditHandler = () => {
        setCommentText(comment.text)
        setIsEditClicked(false);
    }

    useEffect(() => {
        setCommentText(comment.text);
    }, [comment.text])

    return <>
        <li className='comment-item'>
            <div className='comment-header'>
                <div>
                    <img className='owner-picture' src={comment.owner.imageUrl} />
                    <p className='post-owner'><Link to={`/profile/${comment.owner._id}`}>{comment.owner.firstName} {comment.owner.lastName}</Link></p>
                </div>
                <div className='commented-on'>Posted on {comment.postedOn}</div>
            </div>

            {isEditClicked ? (
                <div className="edit-content">
                    <textarea className="edit-textarea" value={commentText} onChange={onTextChangeHandler} placeholder="Edit your post content..."></textarea>
                </div>
            ) : (
                <div className="comment-body">
                    <div className='post-text'>{commentText}</div>
                </div>
            )}
            <div className='button-div'>
                <div></div>
                <div className='owner-buttons'>
                    {(isUser && isUser === comment.owner._id) && (
                        <>
                            {isEditClicked ? (
                                <EditControls
                                    onSaveClickHandler={onSaveEditHandler}
                                    onCancelClickHandler={onCancelEditHandler}
                                />
                            ) : (
                                <OwnerControls
                                    onEditClickHandler={onEditCommentClickHandler}
                                    onDeleteClickHandler={onDeleteCommentClickHandler}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </li >
    </>
}