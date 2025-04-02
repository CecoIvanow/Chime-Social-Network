import { Link } from "react-router"
import { useContext, useEffect, useState } from "react";

import OwnerControls from "../../../shared/controls/owner-controls/OwnerControls";
import EditControls from "../../../shared/controls/edit-controls/EditControls";

import { PostContext } from "../../../../contexts/post-context";
import { UserContext } from "../../../../contexts/user-context";
import { AlertContext } from "../../../../contexts/alert-context";

import useCommentServices from "../../../../hooks/useCommentServices";

export default function CommentItem({
    comment,
}) {
    const [isEditClicked, setIsEditClicked] = useState(false);
    const [onEditCommentText, setOnEditCommentText] = useState('');
    const [commentText, setCommentText] = useState('');

    const { post, setPost } = useContext(PostContext);
    const { isUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const { updateComment, deleteComment } = useCommentServices();

    const onDeleteCommentClickHandler = async () => {
        const isConfirmed = confirm('Are you sure you want to delete this comment?');

        if (!isConfirmed) {
            return;
        }

        try {
            const removedCommentId = await deleteComment(comment._id);

            post.comments = post.comments.filter(comment => comment._id !== removedCommentId);
            setPost({ ...post });
        } catch (error) {
            setAlert(error.message)
        }
    }

    const onEditCommentClickHandler = async () => {
        setIsEditClicked(true);
    }

    const onTextChangeHandler = (e) => {
        setOnEditCommentText(e.currentTarget.value);
    }

    const onSaveEditHandler = async () => {
        try {
            const updatedCommentText = await updateComment(comment._id, onEditCommentText);

            if (updatedCommentText) {
                setCommentText(updatedCommentText);
                setOnEditCommentText(updatedCommentText);
                setIsEditClicked(false);
            }
            
        } catch (error) {
            setAlert(error.message);
        }
    }

    const onCancelEditHandler = () => {
        setOnEditCommentText(commentText);
        setIsEditClicked(false);
    }

    useEffect(() => {
        setCommentText(comment.text);
        setOnEditCommentText(comment.text);
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
                    <textarea className="edit-textarea" defaultValue={onEditCommentText} onChange={onTextChangeHandler} placeholder="Edit your post content..."></textarea>
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