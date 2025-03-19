import { useState } from "react";

import CreateContent from "../../create-content/CreateContent";

import postServices from "../../../../services/post-services";

export default function PostCreateForm({
    userId,
    totalUserPosts,
    setTotalUserPosts,
}) {
    const [postText, setPostText] = useState('');

    const onPostSubmitHandler = async (formData) => {
        const postData = Object.fromEntries(formData);

        if (!postData.text || postData.text === ' ') {
            return;
        }

        postData.owner = userId;

        const newPost = await postServices.handlePostCreate(postData);

        setTotalUserPosts([newPost, ...totalUserPosts]);
        setPostText('');
    }

    const onTextChangeHandler = (e) => {
        setPostText(e.currentTarget.value);
    }

    return <CreateContent
        onTextChangeHandler={onTextChangeHandler}
        onSubmitHandler={onPostSubmitHandler}
        buttonText={'Post'}
        text={postText}
    />
}