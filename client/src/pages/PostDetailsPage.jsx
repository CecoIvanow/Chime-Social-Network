import { Link, useLocation } from "react-router"
import CommentItem from "../components/CommentItem"
import { useEffect, useState } from "react";
import postServices from "../services/post-services";
import commentServices from "../services/comment-services";

export default function PostDetailsPage({
    isUser
}) {
    const location = useLocation();

    const [postData, setPostData] = useState([]);

    const onAddCommentSubmitHandler = async (formData) => {
        const commentData = Object.fromEntries(formData);
        commentData.onPost = location.pathname.split('/').at(2);
        commentData.owner = isUser;

        const newComment = await commentServices.create(commentData);
        setPostData(postData => postData.comments.push(newComment));
    }

    useEffect(() => {
        const postId = location.pathname.split('/').at(2);

        const abortController = new AbortController();
        const abortSignal = abortController.signal;

        postServices.handleGetPostData(postId, abortSignal)
            .then(data => setPostData(data))
            .catch(error => console.error(error.message));

        return () => {
            abortController.abort();
        }

    }, [location.pathname]);

    return <>
        <li className='post-page-body'>
            <div className='post-page-header'>
                <div>
                    <img className='owner-picture' src={postData.owner?.imageUrl} alt="" />
                    <p className='post-owner'><Link>{postData.owner?.firstName} {postData.owner?.lastName}</Link></p>
                </div>
                <div className='created-on'>{postData?.postedOn}</div>
            </div>
            <div className='post-page-text'>{postData?.text}</div>
            <div className="post-interactions">
                <div className="likes">Likes: {postData.likes?.length}</div>
                <div className="comments">Comments: {postData.comments?.length}</div>
            </div>
            <div className='button-div'>
                <div>
                    <button className='button unlike-btn' type="button">Unlike</button>
                    <button className='button' type="button">Like</button>
                </div>
                <div className='owner-buttons'>
                    <button className='button' type="button">Edit</button>
                    <button className='button delete-btn' type="button">Delete</button>
                </div>
            </div>
            <div className="comments-section">
                <form action={onAddCommentSubmitHandler}>
                    <div className='comment-create'>
                        <img src={undefined} />
                        <label htmlFor="comment"></label>
                        <input type="text" name="text" id="comment" placeholder="Add your comment..." />
                    </div>
                    <button className='button comment-btn'>Comment</button>
                </form>
                <div className="post-comments">
                    <p>All Comments:</p>
                    <ul>
                        {postData.comments?.map(comment => {
                            const metaData = {
                                text: comment.text
                            }
                            
                            return <CommentItem
                                key={comment._id}
                                metaData={metaData}
                            />
                        })}
                    </ul>
                </div>
            </div>
        </li >
    </>
}