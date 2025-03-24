import { useContext, useState } from "react";

import CreateContent from "../../create-content/CreateContent";

import postServices from "../../../../services/post-services";
import { UserContext } from "../../../../contexts/user-context";

export default function PostCreateForm({
    totalUserPosts,
    setTotalUserPosts,
}) {
    const [postText, setPostText] = useState('');

    const { isUser } = useContext(UserContext)

    const onPostSubmitHandler = async (formData) => {
        const postData = Object.fromEntries(formData);

        if (!postData.text || postData.text === ' ') {
            return;
        }

        postData.owner = isUser;

        const newPost = await postServices.handlePostCreate(postData);

        setTotalUserPosts([newPost, ...totalUserPosts]);
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