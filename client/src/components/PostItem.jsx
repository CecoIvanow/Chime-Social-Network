import { Link } from "react-router";
import postServices from "../services/post-services";

export default function PostItem({
    postId,
    ownerId,
    isUser,
    text,
    postedOn,
    imageUrl,
    fullName,
    setTotalPosts,
    totalPosts,
}) {

    const onDeletePostClickHandler = async () => {
        const isDeleteCondirmed = confirm('Are you sure you want to delete this post?');

        if (!isDeleteCondirmed) {
            return totalPosts; // Returns totalPosts unnecessarily because eslint marks it as not used!
        }

        const deletedPostId = await postServices.handleDelete(postId);

        setTotalPosts(totalPosts => totalPosts.filter(post => post._id !== deletedPostId))

    }

    return <>
        <li className='post-item'>
            <div className='post-header'>
                <div>
                    <img className='owner-picture' src={imageUrl} alt="" />
                    <p className='post-owner'><Link to={`/profile/${ownerId}`}>{fullName}</Link></p>
                </div>
                <div className='created-on'>Posted on {postedOn}</div>
            </div>
            <div className='post-text'>{text}</div>
            <div className="post-interactions">
                <div className="likes">Likes: 0</div>
                <div className="comments">Comments: 0</div>
            </div>
            <div className='post-buttons-div'>
                <div>
                    {(isUser && isUser !== ownerId) && (
                        <button className='post-buttons like-btn' type="button">Like</button>
                    )}
                </div>
                <div className='owner-buttons'>
                    {isUser === ownerId && (
                        <>
                            <button className='post-buttons edit-btn' type="button">Edit</button>
                            <button className='post-buttons delete-btn' type="button" onClick={onDeletePostClickHandler}>Delete</button>
                        </>
                    )}
                </div>
            </div>
        </li>
    </>
}