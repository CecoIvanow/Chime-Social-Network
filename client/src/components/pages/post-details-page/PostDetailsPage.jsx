import { useLocation, useNavigate } from "react-router"
import { useContext, useEffect, useState } from "react";

import { PostContext } from "../../../contexts/post-context";
import { UserContext } from "../../../contexts/user-context";
import { AlertContext } from "../../../contexts/alert-context";

import CommentItem from "./comment-item/CommentItem"
import CommentCreateForm from "./comment-create-form/CommentCreateForm";
import PostHeader from "../../shared/post/post-header/PostHeader";
import PostText from "../../shared/post/post-text/PostText";
import PostEditContent from "./post-edit-content/PostEditContent";
import usePostServices from "../../../hooks/usePostServices";
import PostInteractions from "../../shared/post/post-interactions/PostInteractions";
import { PostActionsContext } from "../../../contexts/post-actions-context";

export default function PostDetailsPage() {
    const location = useLocation();
    const navigateTo = useNavigate();

    const shouldEdit = location.state?.shouldEdit || false;

    const [post, setPost] = useState({});
    const [postText, setPostText] = useState('');
    const [isEditClicked, setIsEditClicked] = useState(shouldEdit);

    const { isUser: currentUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const { deletePost, editPost, getPostWithComments, likePost, unlikePost, abortAll } = usePostServices()

    useEffect(() => {
        const postId = location.pathname.split('/').at(2);

        getPostWithComments(postId)
            .then(data => {
                if (isEditClicked && (currentUser !== data.owner._id)) {
                    navigateTo('/404');
                }

                setPost(data);
                setPostText(data.text);
            })
            .catch(error => {
                console.error(error);
                setAlert(error.message);
            });

        return () => {
            abortAll();
        }
    }, [location.pathname, currentUser, navigateTo, isEditClicked, setAlert, getPostWithComments, abortAll]);

    if (!post?._id) {
        return null;
    }

    const textChangeHandler = (e) => {
        setPostText(e.currentTarget.value);
    }

    const onCancelEditClickHandler = () => {
        setPostText(post.text);
        setIsEditClicked(false);
    }

    const onSaveEditClickHandler = async () => {
        try {
            const updatedText = await editPost(post._id, postText);

            if (updatedText) {
                setIsEditClicked(false);
            }

        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const onDeletePostClickHandler = async () => {
        const isDeleteConfirmed = confirm('Are you sure you want to delete this post?');

        if (!isDeleteConfirmed) {
            return;
        }

        try {
            await deletePost(post._id);
            navigateTo('/catalog');
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const onEditPostClickHandler = async () => {
        setIsEditClicked(true);
    }

    const onUnlikeClickHandler = async () => {
        try {
            await unlikePost(currentUser, post._id);
            return true;
        } catch (error) {
            console.error(error);
            setAlert(error.message);
            return false;
        }
    }

    const onLikeClickHandler = async () => {
        try {
            await likePost(currentUser, post._id);
            return true;
        } catch (error) {
            console.error(error);
            setAlert(error.message);
            return false;
        }
    }

    const postActionsContextValues = {
        isEditClicked,
        onLikeClickHandler,
        onUnlikeClickHandler,
        onEditPostClickHandler,
        onSaveEditClickHandler,
        onCancelEditClickHandler,
        onDeletePostClickHandler,
    }

    const postContextValues = {
        post,
        setPost
    }

    return (
        <PostContext.Provider value={postContextValues}>
            <li className='post-page-body'>

                <PostHeader />

                {isEditClicked ? (
                    <PostEditContent
                        postText={postText}
                        textChangeHandler={textChangeHandler}
                    />
                ) : (
                    <PostText
                        postText={postText}
                    />
                )}

                <PostActionsContext.Provider value={postActionsContextValues}>
                    <PostInteractions />
                </PostActionsContext.Provider>

                <div className="comments-section">
                    {currentUser && (
                        <CommentCreateForm />
                    )}
                    <div className="post-comments">
                        <p>All Comments:</p>
                        <ul>
                            {post.comments.map(comment =>
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                />
                            )}
                        </ul>
                    </div>
                </div>
            </li >
        </PostContext.Provider>
    )
}