export default function PostItem({
    ownerId,
    isUser,
    text,
    postedOn,
    imageUrl,
    fullName,
}) {

    return <>
        <li className='post-item'>
            <div className='post-header'>
                <div>
                    <img className='owner-picture' src={imageUrl} alt="" />
                    <p className='post-owner'>{fullName}</p>
                </div>
                <div className='created-on'>Posted on {postedOn}</div>
            </div>
            <div className='post-text'>{text}</div>
            <div className='post-buttons-div'>
                <div>
                    {(isUser && ownerId !== isUser) && (
                        <button className='post-buttons like-btn' type="button">Like</button>
                    )}
                </div>
                <div className='owner-buttons'>
                    {isUser && (
                        <>
                            <button className='post-buttons edit-btn' type="button">Edit</button>
                            <button className='post-buttons delete-btn' type="button">Delete</button>
                        </>
                    )}
                </div>
            </div>
        </li>
    </>
}