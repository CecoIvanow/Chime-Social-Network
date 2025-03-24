export default function PostEditContent({
    postText,
    textChangeHandler,
}) {
    return <>
        <div className="edit-content">
            <textarea className="edit-textarea" value={postText} onChange={textChangeHandler} placeholder="Edit your post content..."></textarea>
        </div>
    </>
}