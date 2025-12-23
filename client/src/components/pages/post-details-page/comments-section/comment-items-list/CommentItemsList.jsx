import { useContext, useEffect, useState } from "react";

import CommentItem from "./comment-item/CommentItem";

import { ActionsContext } from "../../../../../contexts/actions-context";
import { PostContext } from "../../../../../contexts/post-context";
import { AlertContext } from "../../../../../contexts/alert-context";

import useCommentServices from "../../../../../hooks/useCommentServices";

export default function CommentItemsList() {
    const [isEditClicked, setIsEditClicked] = useState(false);
    const [onEditCommentText, setOnEditCommentText] = useState('');
    const [commentText, setCommentText] = useState('');

    const { setAlert } = useContext(AlertContext);
    const { post, setPost } = useContext(PostContext);

    const { updateComment, deleteComment, abortAll } = useCommentServices();

    const onDeleteCommentClickHandler = async (commentId) => {
        const isConfirmed = confirm('Are you sure you want to delete this comment?');

        if (!isConfirmed) {
            return;
        }

        try {
            const removedCommentId = await deleteComment(commentId);

            setPost(prevPost => ({
                ...prevPost,
                comments: prevPost.comments.filter(comment => comment._id !== removedCommentId)
            }));
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

    const onSaveEditClickHandler = async (commentId) => {
        try {
            const updatedCommentText = await updateComment(commentId, onEditCommentText);

            if (updatedCommentText) {
                setCommentText(updatedCommentText);
                setOnEditCommentText(updatedCommentText);
                setIsEditClicked(false);
            }

        } catch (error) {
            setAlert(error.message);
        }
    }

    const onCancelEditClickHandler = () => {
        setOnEditCommentText(commentText);
        setIsEditClicked(false);
    }

    const commentActionsContextValues = {
        isEditClicked,
        onEditCommentText,
        setOnEditCommentText,
        commentText,
        setCommentText,
        onTextChangeHandler,
        onSaveEditClickHandler,
        onCancelEditClickHandler,
        onEditClickHandler: onEditCommentClickHandler,
        onDeleteClickHandler: onDeleteCommentClickHandler,
    }

    useEffect(() => {
        return () => {
            abortAll();
        }
    }, [abortAll])


    return <ul>
        {post.comments.map(comment =>
            <ActionsContext.Provider
                key={comment._id}
                value={commentActionsContextValues}
            >
                <CommentItem
                    key={comment._id}
                    comment={comment}
                />
            </ActionsContext.Provider>
        )}
    </ul>
}