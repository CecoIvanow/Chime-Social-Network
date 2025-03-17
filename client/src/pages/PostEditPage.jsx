export default function PostEditPage() {
    return <>
        <div className="edit-post-container">
            <div className='post-header'>
                <div>
                    <img className='owner-picture' src="" alt="" />
                    <p className='post-owner'>Ivan Ivanovich</p>
                </div>
                <div className='created-on'>Posted on</div>
            </div>

            <div className="edit-content">
                <textarea className="edit-textarea" placeholder="Edit your post content...">
                    Just climbed Mount Everest! What an incredible experience! Can't wait to share more photos soon.
                </textarea>
            </div>

            <div className='button-div'>
                <div>
                </div>
                <div className="owner-buttons">
                    <button className='button' type="button">Edit</button>
                    <button className='button delete-btn' type="button" >Delete</button>
                </div>
            </div>
        </div>
    </>
}