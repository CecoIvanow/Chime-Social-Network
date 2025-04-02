import { useContext, useEffect, useState } from "react";

import PostHeader from "../../post-header/PostHeader";
import PostInteractions from "./post-interactions/PostInteractions";
import LinkButton from "../../../../ui/buttons/link-button/LinkButton";
import OwnerControls from "../../../controls/owner-controls/OwnerControls";
import PostInteractionButtons from "../../post-interaction-buttons/PostInteractionButtons";

import { AlertContext } from "../../../../../contexts/alert-context";
import { UserContext } from "../../../../../contexts/user-context";
import { TotalPostsContext } from "../../../../../contexts/total-posts-context";
import { PostContext } from "../../../../../contexts/post-context";

import usePostServices from "../../../../../hooks/usePostServices";

export default function PostItem({
    post,
}) {
    const [isLiked, setIsLiked] = useState(false);

    const { setAlert } = useContext(AlertContext);
    const { isUser } = useContext(UserContext);
    const { totalPosts, setTotalPosts } = useContext(TotalPostsContext)

    const { deletePost, likePost, unlikePost } = usePostServices();

    useEffect(() => {
        if (post?.likes.includes(isUser)) {
            setIsLiked(true);
        }
    }, [post?.likes, isUser]);

    if (!post?._id) {
        return null;
    }

    const onDeletePostClickHandler = async () => {
        const isDeleteCondirmed = confirm('Are you sure you want to delete this post');

        if (!isDeleteCondirmed) {
            return totalPosts; // Returns totalPosts unnecessarily because otherwise eslint marks it as not used!
        }

        try {
            const deletedPostId = await deletePost(post._id);

            setTotalPosts(totalPosts => totalPosts.filter(post => post._id !== deletedPostId))
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const onLikePostClickHandler = async () => {
        try {
            await likePost(isUser, post._id);
            post.likes.push(isUser);
            setIsLiked(true);
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const onUnlikePostClockHandler = async () => {
        try {
            await unlikePost(isUser, post._id);
            post.likes = post.likes.filter(userLike => userLike !== isUser);
            setIsLiked(false);
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    return (
        <PostContext.Provider value={{ post }}>
            <li className='post-item'>

                <PostHeader />

                <div className='post-text'>{post.text}</div>

                <PostInteractions />

                <div className='button-div'>
                    <div>
                        {isUser && (
                            <>
                                {(isUser !== post.owner._id &&
                                    <PostInteractionButtons
                                        isLiked={isLiked}
                                        onLikeClickHandler={onLikePostClickHandler}
                                        onUnlikeClickHandler={onUnlikePostClockHandler}
                                    />
                                )}

                                <LinkButton
                                    urlLink={`/post/${post._id}/details`}
                                    btnStyle="button comment-btn"
                                    buttonName="Comment"
                                />
                            </>
                        )}
                    </div>
                    <div>
                        {isUser && isUser === post.owner._id && (
                            <OwnerControls
                                urlLink={`/post/${post._id}/edit`}
                                onDeleteClickHandler={onDeletePostClickHandler}
                            />
                        )}
                    </div>
                </div>
            </li >
        </PostContext.Provider>
    )
}