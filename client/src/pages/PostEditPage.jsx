import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"


import postServices from "../services/post-services";

export default function PostEditPage() {

    const location = useLocation();
    const navigateTo = useNavigate();

    const [postData, setPostData] = useState({});
    const [postText, setPostText] = useState('');

    const textChangeHandler = (e) => {
        setPostText(e.currentTarget.value);
    }

    useEffect(() => {
        const postId = location.pathname.split('/').at(2);

        const abortController = new AbortController();
        const abortSignal = abortController.signal;

        postServices.handleGetPostData(postId, abortSignal)
            .then(data => {
                setPostData(data);
                setPostText(data.text);
            })
            .catch(error => console.error(error.message));

        return () => {
            abortController.abort();
        }
    }, [location.pathname]);

    return <>
        <div className="edit-post-container">
            <div className='post-header'>
                <div>
                    <img className='owner-picture' src={postData.owner?.imageUrl} />
                    <p className='post-owner'><Link to="">{postData.owner?.firstName} {postData.owner?.lastName}</Link></p>
                </div>
                <div className='created-on'>Posted on {postData?.postedOn}</div>
            </div>

            <div className="edit-content">
                <textarea className="edit-textarea" value={postText} onChange={textChangeHandler} placeholder="Edit your post content..."></textarea>
            </div>

            <div className='button-div'>
                <div>
                </div>
                <div className="owner-buttons">
                    <button className='button' type="button">Save</button>
                    <button className='button delete-btn' type="button" >Cancel</button>
                </div>
            </div>
        </div>
    </>
}