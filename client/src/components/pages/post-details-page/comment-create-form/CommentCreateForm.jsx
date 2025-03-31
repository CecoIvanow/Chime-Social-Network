import { useContext, useState } from "react";

import CreateContent from "../../../ui/create-content/CreateContent";

import { PostContext } from "../../../../contexts/post-context";
import { UserContext } from "../../../../contexts/user-context";
import { AlertContext } from "../../../../contexts/alert-context";

import commentServices from "../../../../services/comment-services";

export default function CreateCommentForm() {
    const [commentText, setCommentText] = useState('');

    const { post, setPost } = useContext(PostContext)
    const { isUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const onAddCommentSubmitHandler = async (formData) => {
        const commentData = Object.fromEntries(formData);
        commentData.onPost = location.pathname.split('/').at(2);
        commentData.owner = isUser;
        if (!commentData.text.trim()) {
            return;
        }

        try {
            const newComment = await commentServices.handleCreate(commentData);

            if (!newComment) {
                return;
            }

            post.comments.unshift(newComment);
            setPost({ ...post });
            setCommentText('');
        } catch (error) {
            setAlert(error.message);
        }

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