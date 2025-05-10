import { memo, useContext } from "react"

import { PostContext } from "../../../../../../contexts/post-context"

function PostCommentsAmount() {
    const { post } = useContext(PostContext);

    return <>
        <div className="comments">Comments: {post.comments.length}</div>
    </>
}

export default memo(PostCommentsAmount);