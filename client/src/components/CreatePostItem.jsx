export default function CreatePostItem() {
    return <>
        <div className='post-create'>
            <form >
                <div className='post-header'>
                    <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                    <label htmlFor="post"></label>
                    <input type="text" name="post" id="post" placeholder="Share your thoughts..." />
                </div>
                <button className='submit-button' >Post</button>
            </form>
        </div>
    </>
}