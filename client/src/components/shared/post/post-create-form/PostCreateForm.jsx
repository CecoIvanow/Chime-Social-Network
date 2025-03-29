import { useContext, useState } from "react";

import postServices from "../../../../services/post-services";

import { UserContext } from "../../../../contexts/user-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";

import CreateContent from "../../create-content/CreateContent";

export default function PostCreateForm() {
    const [postText, setPostText] = useState('');

    const { totalPosts, setTotalPosts } = useContext(TotalPostsContext);
    const { isUser } = useContext(UserContext);

    const onPostSubmitHandler = async (formData) => {
        const postData = Object.fromEntries(formData);

        if (!postData.text || postData.text === ' ') {
            return;
        }

        postData.owner = isUser;

        const newPost = await postServices.handlePostCreate(postData);

        setTotalPosts([newPost, ...totalPosts]);
        setPostText('');
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