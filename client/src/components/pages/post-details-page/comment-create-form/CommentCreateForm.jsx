import { useContext, useState } from "react";

import commentServices from "../../../../services/comment-services";

import { PostContext } from "../../../../contexts/post-context";
import { UserContext } from "../../../../contexts/user-context";

import CreateContent from "../../../shared/create-content/CreateContent";

export default function CreateCommentForm() {
    const [commentText, setCommentText] = useState('');

    const { post, setPost } = useContext(PostContext)
    const { isUser } = useContext(UserContext);

    const onAddCommentSubmitHandler = async (formData) => {
        const commentData = Object.fromEntries(formData);
        commentData.onPost = location.pathname.split('/').at(2);
        commentData.owner = isUser;

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