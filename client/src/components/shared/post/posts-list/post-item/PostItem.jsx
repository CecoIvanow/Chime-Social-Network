import { useState } from "react";

import PostHeader from "../../post-header/PostHeader";
import PostInteractions from "./post-interactions/PostInteractions";
import PostText from "../../../../pages/post-details-page/post-text/PostText";

import { PostContext } from "../../../../../contexts/post-context";

export default function PostItem({
    postItem,
}) {
    const [post, setPost] = useState(postItem);

    if (!post?._id) {
        return null;
    }

    return (
        <PostContext.Provider value={{ post, setPost }}>
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
