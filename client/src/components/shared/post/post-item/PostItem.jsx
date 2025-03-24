import { useEffect, useState } from "react";

import postServices from "../../../../services/post-services";

import OwnerControls from "../../controls/owner-controls/OwnerControls";
import LinkButton from "../../../ui/buttons/link-button/LinkButton";
import PostInteractionButtons from "../post-interaction-buttons/PostInteractionButtons";
import PostInteractions from "./post-interactions/PostInteractions";
import PostHeader from "../post-header/PostHeader";
import { PostContext } from "../../../../contexts/post-context";

export default function PostItem({
    post,
    userId,
    totalPosts,
    setTotalPosts,
}) {

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (post?.likes.includes(userId)) {
            setIsLiked(true);
        }
    }, [post?.likes, userId]);

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
        await postServices.handleLike(userId, post._id);
        post.likes.push(userId);
        setIsLiked(true);
    }

    const onUnlikePostClockHandler = async () => {
        await postServices.handleUnlike(userId, post._id);
        post.likes = post.likes.filter(userLike => userLike !== userId);
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
                        {userId && (
                            <>
                                {(userId !== post.owner._id &&
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
                        {userId === post.owner._id && (
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