import { useLocation, useNavigate } from "react-router"
import { useContext, useEffect, useState } from "react";

import { PostContext } from "../../../contexts/post-context";
import { UserContext } from "../../../contexts/user-context";
import { AlertContext } from "../../../contexts/alert-context";

import CommentCreateForm from "./comment-create-form/CommentCreateForm";
import CommentsSection from "./comments-section/CommentsSection";
import PostEditContent from "./post-edit-content/PostEditContent";
import PostHeader from "../../shared/post/post-header/PostHeader";
import PostInteractions from "../../shared/post/post-interactions/PostInteractions";
import PostText from "../../shared/post/post-text/PostText";

import { ActionsContext } from "../../../contexts/actions-context";

import usePostServices from "../../../hooks/usePostServices";

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

    const onSaveEditClickHandler = async (postId) => {
        try {
            const updatedText = await editPost(postId, postText);

            if (updatedText) {
                setIsEditClicked(false);
            }

        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const onDeletePostClickHandler = async (postId) => {
        const isDeleteConfirmed = confirm('Are you sure you want to delete this post?');

        if (!isDeleteConfirmed) {
            return;
        }

        try {
            await deletePost(postId);
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

    const actionsContextValues = {
        isEditClicked,
        onLikeClickHandler,
        onUnlikeClickHandler,
        onEditPostClickHandler,
        onSaveEditClickHandler,
        onCancelEditClickHandler,
        onDeleteClickHandler: onDeletePostClickHandler,
    }

    const postContextValues = {
        post,
        setPost
    }

    return (
        <PostContext.Provider value={postContextValues}>
            <div className='post-page-body'>
                <PostHeader />

                {isEditClicked ? (
                    <PostEditContent
                        postText={postText}
                        textChangeHandler={textChangeHandler}trigge
                    />
                ) : (
                    <PostText
                        postText={postText}
                    />
                )}

                <ActionsContext.Provider value={actionsContextValues}>
                    <PostInteractions />
                </ActionsContext.Provider>

                {currentUser && (
                    <CommentCreateForm />
                )}

                <CommentsSection />
            </div >
        </PostContext.Provider>
    )
}