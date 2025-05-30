import { useContext, useEffect, useState } from "react";

import useCommentServices from "../../../../hooks/useCommentServices";

import CreateContentInputField from "../../../shared/input-fields/create-content-input-field/CreateContentInputField";

import { PostContext } from "../../../../contexts/post-context";
import { UserContext } from "../../../../contexts/user-context";
import { AlertContext } from "../../../../contexts/alert-context";

export default function CreateCommentForm() {
    const [commentText, setCommentText] = useState('');

    const { post, setPost } = useContext(PostContext)
    const { isUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const { createComment, abortAll } = useCommentServices();

    useEffect(() => {
        return () => {
            abortAll();
        }
    }, [abortAll])

    const onAddCommentSubmitHandler = async (formData) => {
        const commentData = Object.fromEntries(formData);

        commentData.onPost = location.pathname.split('/').at(2);
        commentData.owner = isUser;

        try {
            const newComment = await createComment(commentData);

            if (!newComment) {
                return;
            }

            post.comments.unshift(newComment);
            setPost({ ...post });
            setCommentText('');
        } catch (error) {
            setAlert(error.message);
        }

    };

    const onTextChangeHandler = (e) => {
        setCommentText(e.currentTarget.value);
    }

    return <CreateContentInputField
        onTextChangeHandler={onTextChangeHandler}
        onSubmitHandler={onAddCommentSubmitHandler}
        buttonText={'Reply'}
        text={commentText}
    />
}