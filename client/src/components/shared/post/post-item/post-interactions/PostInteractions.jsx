import { useContext } from "react"

import { PostContext } from "../../../../../contexts/post-context"

export default function PostInteractions() {

    const { post } = useContext(PostContext);

    return <>
        <div className="post-interactions">
            <div className="likes">Likes: {post.likes.length}</div>
            <div className="comments">Comments: {post.comments.length}</div>
        </div>
    </>
}