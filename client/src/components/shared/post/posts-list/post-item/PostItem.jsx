import { useState } from "react";

import PostHeader from "../../post-header/PostHeader";
import PostInteractions from "../../post-interactions/PostInteractions";
import PostText from "../../post-text/PostText";

import { PostContext } from "../../../../../contexts/post-context";

export default function PostItem({
    postItem,
}) {
    const [post, setPost] = useState(postItem);

    if (!post?._id) {
        return null;
    }

    const postContextValues = {
        post,
        setPost
    }

    return (
        <PostContext.Provider value={postContextValues}>
            <li className='post-item'>

                <PostHeader />

                <PostText
                    postText={post.text}
                />

                <PostInteractions />
            </li >
        </PostContext.Provider>
    )
}
