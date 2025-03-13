import { useState } from "react";
import postServices from "../services/post-services.js";

// TODO: Clear inut field when a post is created

export default function CreatePostItem({
    userId,
    imageUrl,
    totalUserPosts,
    setTotalUserPosts,
}) {
    const [postText, setPostText] = useState();

    const onPostSubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
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

    return <>
        <div className='post-create'>
            <form onSubmit={onPostSubmitHandler}>
                <div className='post-header'>
                    <img src={imageUrl} />
                    <label htmlFor="post"></label>
                    <input type="text" name="text" id="post" value={postText} onChange={onTextChangeHandler} placeholder="Share your thoughts..." />
                </div>
                <button className='submit-button' >Post</button>
            </form>
        </div>
    </>
}