import { Link } from "react-router"

export default function CommentItem({
    metaData,
    creatorData,
}) {
    return <>
        <li className='comment-item'>
            <div className='post-header'>
                <div>
                    <img className='owner-picture' src={creatorData.imageUrl}/>
                    <p className='post-owner'><Link to={`/profile/${creatorData.id}`}>{creatorData.firstName} {creatorData.lastName}</Link></p>
                </div>
                <div className='commented-on'>Posted on {metaData.postedOn}</div>
            </div>
            <div className='post-text'>{metaData.text}</div>
            <div className='button-div'>
                <div>
                </div>
                <div className='owner-buttons'>
                    <button className='button' type="button">Edit</button>
                    <button className='button delete-btn' type="button">Delete</button>
                </div>
            </div>
        </li >
    </>
}