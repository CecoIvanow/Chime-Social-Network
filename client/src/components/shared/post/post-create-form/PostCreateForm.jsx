import { useContext, useState } from "react";

import postServices from "../../../../services/post-services";

import { UserContext } from "../../../../contexts/user-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";

import CreateContent from "../../../ui/create-content/CreateContent";
import { AlertContext } from "../../../../contexts/alert-context";

export default function PostCreateForm({
    userData
}) {
    const [postText, setPostText] = useState('');

    const { totalPosts, setTotalPosts } = useContext(TotalPostsContext);
    const { setAlert } = useContext(AlertContext);
    const { isUser } = useContext(UserContext);

    const onPostSubmitHandler = async (formData) => {
        const postData = Object.fromEntries(formData);
        
        postData.text = postData.text.trim();
        postData.owner = isUser;

        try {
            const newPost = await postServices.handlePostCreate(postData);

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

    return <CreateContent
        text={postText}
        buttonText={'Post'}
        onTextChangeHandler={onTextChangeHandler}
        onSubmitHandler={onPostSubmitHandler}
    />
}