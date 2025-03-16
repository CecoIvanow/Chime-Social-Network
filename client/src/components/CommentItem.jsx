import { Link } from "react-router"
import commentServices from "../services/comment-services"

export default function CommentItem({
    isUser,
    metaData,
    creatorData,
}) {

    const onDeleteCommentClickHandler = async () => {
        const isConfirmed = confirm('Are you sure you want to delete this comment?');

        if (!isConfirmed) {
            return;
        }

        const removedCommentId = await commentServices.handleDelete(metaData.id);

        console.log(removedCommentId);
    }

    return <>
        <li className='comment-item'>
            <div className='post-header'>
                <div>
                    <img className='owner-picture' src={creatorData.imageUrl} />
                    <p className='post-owner'><Link to={`/profile/${creatorData.id}`}>{creatorData.firstName} {creatorData.lastName}</Link></p>
                </div>
                <div className='commented-on'>Posted on {metaData.postedOn}</div>
            </div>
            <div className='post-text'>{metaData.text}</div>
            <div className='button-div'>
                <div>
                </div>
                <div className='owner-buttons'>
                    {isUser === creatorData.id && (
                        <>
                            <button className='button' type="button">Edit</button>
                            <button className='button delete-btn' type="button" onClick={onDeleteCommentClickHandler}>Delete</button>
                        </>
                    )}
                </div>
            </div>
        </li >
    </>
}