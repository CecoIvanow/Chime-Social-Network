import { useLocation, useNavigate } from "react-router"
import { useContext, useEffect, useState } from "react";

import { PostContext } from "../../../contexts/post-context";
import { UserContext } from "../../../contexts/user-context";
import { AlertContext } from "../../../contexts/alert-context";

import CommentItem from "./comment-item/CommentItem"
import CommentCreateForm from "./comment-create-form/CommentCreateForm";
import PostHeader from "../../shared/post/post-header/PostHeader";
import PostText from "./post-text/PostText";
import PostEditContent from "./post-text/post-edit-content/PostEditContent";
import usePostServices from "../../../hooks/usePostServices";
import PostInteractions from "../../shared/post/posts-list/post-item/post-interactions/PostInteractions";

export default function PostDetailsPage() {
    const location = useLocation();
    const navigateTo = useNavigate();

    const shouldEdit = location.state?.shouldEdit || false;

    const [post, setPost] = useState({});
    const [postText, setPostText] = useState('');
    const [isEditClicked, setIsEditClicked] = useState(shouldEdit);

    const { isUser: currentUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const { deletePost, editPost, getPostWithComments } = usePostServices()

    useEffect(() => {
        const postId = location.pathname.split('/').at(2);

        const abortController = new AbortController();
        const abortSignal = abortController.signal;

        getPostWithComments(postId, abortSignal)
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
            abortController.abort();
        }

    }, [location.pathname, currentUser, navigateTo, isEditClicked, setAlert, getPostWithComments]);

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

    return (
        <PostContext.Provider value={{ post, setPost }}>
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

                <PostInteractions
                    isEditClicked={isEditClicked}
                    onDeletePostClickHandler={onDeletePostClickHandler}
                    onEditPostClickHandler={onEditPostClickHandler}
                    onSaveEditClickHandler={onSaveEditClickHandler}
                    onCancelEditClickHandler={onCancelEditClickHandler}
                />

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