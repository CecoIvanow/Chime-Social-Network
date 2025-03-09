

export default function PostItem({
    text,
    postedOn,
    imageUrl,
}) {
    
    return <>
        <li className='post-item'>
            <div className='post-header'>
                <div>
                    <img className='owner-picture' src={imageUrl} alt="" />
                    <p className='post-owner'>John Doe</p>
                </div>
                <div className='created-on'>Posted on {postedOn}</div>
            </div>
            <div className='post-text'>{text}</div>
            <div className='post-buttons-div'>
                <div>
                    <button className='post-buttons like-btn' type="button">Like</button>
                </div>
                <div className='owner-buttons'>
                    <button className='post-buttons edit-btn' type="button">Edit</button>
                    <button className='post-buttons delete-btn' type="button">Delete</button>
                </div>
            </div>
        </li>
    </>
}