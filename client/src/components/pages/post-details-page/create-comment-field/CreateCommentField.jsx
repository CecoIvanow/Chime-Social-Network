import { useState } from "react";

import CreateEntry from "../../../shared/create-entry/CreateEntry";

import commentServices from "../../../../services/comment-services";

export default function CreateCommentField({
    userId,
    postData,
    setPostData
}) {
    const [commentText, setCommentText] = useState('');

    const onAddCommentSubmitHandler = async (formData) => {
        const commentData = Object.fromEntries(formData);
        commentData.onPost = location.pathname.split('/').at(2);
        commentData.owner = userId;

        const newComment = await commentServices.handleCreate(commentData);
        postData.comments.unshift(newComment);
        setPostData({ ...postData });
        setCommentText('');
    }

    const onTextChangeHandler = (e) => {
        setCommentText(e.currentTarget.value);
    }

    return <CreateEntry
        onTextChangeHandler={onTextChangeHandler}
        onSubmitHandler={onAddCommentSubmitHandler}
        buttonText={'Reply'}
        text={commentText}
    />
}