import { useContext, useState } from "react";

import commentServices from "../../../../services/comment-services";

import CreateContent from "../../../shared/create-content/CreateContent";

import { PostContext } from "../../../../contexts/post-context";

export default function CreateCommentForm({
    userId,
}) {
    const [commentText, setCommentText] = useState('');

    const { post, setPost } = useContext(PostContext)

    const onAddCommentSubmitHandler = async (formData) => {
        const commentData = Object.fromEntries(formData);
        commentData.onPost = location.pathname.split('/').at(2);
        commentData.owner = userId;

        const newComment = await commentServices.handleCreate(commentData);
        post.comments.unshift(newComment);
        setPost({ ...post });
        setCommentText('');
    }

    const onTextChangeHandler = (e) => {
        setCommentText(e.currentTarget.value);
    }

    return <CreateContent
        onTextChangeHandler={onTextChangeHandler}
        onSubmitHandler={onAddCommentSubmitHandler}
        buttonText={'Reply'}
        text={commentText}
    />
}