import { useContext, useEffect, useState } from "react";

import postServices from "../../../../services/post-services";

import { TotalPostsContext } from "../../../../contexts/total-posts-context";
import { PostContext } from "../../../../contexts/post-context";
import { UserContext } from "../../../../contexts/user-context";

import OwnerControls from "../../controls/owner-controls/OwnerControls";
import LinkButton from "../../../ui/buttons/link-button/LinkButton";
import PostInteractionButtons from "../post-interaction-buttons/PostInteractionButtons";
import PostInteractions from "./post-interactions/PostInteractions";
import PostHeader from "../post-header/PostHeader";

export default function PostItem({
    post,
}) {
    const [isLiked, setIsLiked] = useState(false);

    const { totalPosts, setTotalPosts } = useContext(TotalPostsContext);
    const { isUser } = useContext(UserContext);

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

        const deletedPostId = await postServices.handleDelete(post._id);

        setTotalPosts(totalPosts => totalPosts.filter(post => post._id !== deletedPostId))
    }

    const onLikePostClickHandler = async () => {
        await postServices.handleLike(isUser, post._id);
        post.likes.push(isUser);
        setIsLiked(true);
    }

    const onUnlikePostClockHandler = async () => {
        await postServices.handleUnlike(isUser, post._id);
        post.likes = post.likes.filter(userLike => userLike !== isUser);
        setIsLiked(false);
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
                        {isUser === post.owner._id && (
                            <OwnerControls
                                urlLink={`/post/${post._id}/details`}
                                onDeleteClickHandler={onDeletePostClickHandler}
                            />
                        )}
                    </div>
                </div>
            </li >
        </PostContext.Provider>
    )
}