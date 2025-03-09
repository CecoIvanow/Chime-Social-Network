import postServices from "../services/post-services.js";

export default function CreatePostItem({
    userId,
    imageUrl,
}) {
    const onPostSubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const postData = Object.fromEntries(formData);

        if (!postData.text || postData.text === ' ') {
            return;
        }

        postData.owner = userId;

        await postServices.handlePostCreate(postData);
    }

    return <>
        <div className='post-create'>
            <form onSubmit={onPostSubmitHandler}>
                <div className='post-header'>
                    <img src={imageUrl} />
                    <label htmlFor="post"></label>
                    <input type="text" name="text" id="post" placeholder="Share your thoughts..." />
                </div>
                <button className='submit-button' >Post</button>
            </form>
        </div>
    </>
}