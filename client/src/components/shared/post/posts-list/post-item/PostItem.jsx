import {  useState } from "react";

import PostHeader from "../../post-header/PostHeader";
import PostInteractions from "./post-interactions/PostInteractions";

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

                <div className='post-text'>{post.text}</div>

                <PostInteractions />
            </li >
        </PostContext.Provider>
    )
}