import postServices from "../services/post-services.js";

export default function CreatePostItem({
    userId
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
                    <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                    <label htmlFor="post"></label>
                    <input type="text" name="text" id="post" placeholder="Share your thoughts..." />
                </div>
                <button className='submit-button' >Post</button>
            </form>
        </div>
    </>
}