import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";

import CreateContent from "../../../ui/create-content/CreateContent";
import usePostServices from "../../../../hooks/usePostServices";

import { UserContext } from "../../../../contexts/user-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";
import { AlertContext } from "../../../../contexts/alert-context";

export default function PostCreateForm() {
    const [postText, setPostText] = useState('');

    const { totalPosts, setTotalPosts } = useContext(TotalPostsContext);
    const { setAlert } = useContext(AlertContext);
    const { isUser } = useContext(UserContext);

    const { userId } = useParams();

    const { createPost, abortAll } = usePostServices();

    const onPostSubmitHandler = async (formData) => {
        const postData = Object.fromEntries(formData);

        postData.owner = isUser;

        try {
            const newPost = await createPost(postData);

            if (!newPost) {
                return
            }

            setTotalPosts([newPost, ...totalPosts]);
            setPostText('');
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const onTextChangeHandler = (e) => {
        setPostText(e.currentTarget.value);
    }

    useEffect(() => {
        return () => {
            abortAll();
        }
    }, [abortAll])

    return <>
        {(isUser && isUser === userId) && (
            <CreateContent
                text={postText}
                buttonText={'Post'}
                onTextChangeHandler={onTextChangeHandler}
                onSubmitHandler={onPostSubmitHandler}
            />
        )}
    </>
}