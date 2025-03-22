export default function PostInteractions({
    comments,
    likes,
}) {
    return <>
        <div className="post-interactions">
            <div className="likes">Likes: {likes.length}</div>
            <div className="comments">Comments: {comments.length}</div>
        </div>
    </>
}