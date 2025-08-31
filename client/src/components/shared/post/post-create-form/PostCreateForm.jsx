import { useContext, useEffect, useState } from "react";

import CreateContentInputField from "../../input-fields/create-content-input-field/CreateContentInputField";

import usePostServices from "../../../../hooks/usePostServices";

import { UserContext } from "../../../../contexts/user-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";
import { AlertContext } from "../../../../contexts/alert-context";

export default function PostCreateForm() {
    const [postText, setPostText] = useState('');

    const { totalPosts, setTotalPosts } = useContext(TotalPostsContext);
    const { setAlert } = useContext(AlertContext);
    const { isUser } = useContext(UserContext);

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
        <CreateContentInputField
            text={postText}
            buttonText={'Post'}
            onTextChangeHandler={onTextChangeHandler}
            onSubmitHandler={onPostSubmitHandler}
        />
    </>
}