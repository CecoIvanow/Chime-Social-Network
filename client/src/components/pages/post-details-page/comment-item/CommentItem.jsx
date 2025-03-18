import { Link } from "react-router"

import commentServices from "../../../../services/comment-services"
import { useEffect, useState } from "react";
import CreateEntry from "../../../shared/create-entry/CreateEntry";

export default function CommentItem({
    isUser,
    metaData,
    creatorData,
    postData,
    setPostData,
}) {

    const [isEditClicked, setIsEditClicked] = useState(false);
    const [commentText, setCommentText] = useState('');

    const onDeleteClickHandler = async () => {
        const isConfirmed = confirm('Are you sure you want to delete this comment?');

        if (!isConfirmed) {
            return;
        }

        const removedCommentId = await commentServices.handleDelete(metaData.id);

        postData.comments = postData.comments.filter(comment => comment._id !== removedCommentId);
        setPostData({ ...postData });
    }

    const onEditClickHandler = async () => {
        setIsEditClicked(true);
    }

    const onCommentEditTextChangeHandler = (e) => {
        setCommentText(e.currentTarget.value);
    }

    const onSaveCommentTextHandler = async (formData) => {
        const payLoad = Object.fromEntries(formData);

        await commentServices.handleUpdate(metaData.id, payLoad);


        setIsEditClicked(false);
    }

    useEffect(() => {
        setCommentText(metaData.text);
    }, [metaData.text])

    return <>
        <li className='comment-item'>
            <div className='comment-header'>
                <div>
                    <img className='owner-picture' src={creatorData.imageUrl} />
                    <p className='post-owner'><Link to={`/profile/${creatorData.id}`}>{creatorData.firstName} {creatorData.lastName}</Link></p>
                </div>
                <div className='commented-on'>Posted on {metaData.postedOn}</div>
            </div>

            {isEditClicked ? (
                <CreateEntry
                    onTextChangeHandler={onCommentEditTextChangeHandler}
                    onSubmitHandler={onSaveCommentTextHandler}
                    placeholderText={'Edit your comment...'}
                    buttonText={'Save'}
                    text={commentText}
                />
            ) : (
                <div className="comment-body">
                    <div className='post-text'>{commentText}</div>
                    <div className='button-div'>
                        <div>
                        </div>
                        <div className='owner-buttons'>
                            {isUser === creatorData.id && (
                                <>
                                    <button className='button' type="button" onClick={onEditClickHandler}>Edit</button>
                                    <button className='button delete-btn' type="button" onClick={onDeleteClickHandler}>Delete</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </li >
    </>
}