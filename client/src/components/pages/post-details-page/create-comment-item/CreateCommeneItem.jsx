import commentServices from "../../../../services/comment-services";

export default function CreateCommentItem({
    isUser,
    postData,
    setPostData
}) {

    const onAddCommentSubmitHandler = async (formData) => {
        const commentData = Object.fromEntries(formData);
        commentData.onPost = location.pathname.split('/').at(2);
        commentData.owner = isUser;

        const newComment = await commentServices.create(commentData);
        postData.comments.unshift(newComment);
        setPostData({ ...postData });
    }

    return <>
        <form action={onAddCommentSubmitHandler}>
            <div className='comment-create'>
                <label htmlFor="comment"></label>
                <input type="text" name="text" id="comment" placeholder="Add your comment..." />
            </div>
            <button className='button comment-btn'>Comment</button>
        </form>
    </>
}