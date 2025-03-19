import { useEffect, useState } from "react";

import postServices from "../../../../services/post-services";

import OwnerControls from "../../controls/owner-controls/OwnerControls";
import LinkButton from "../../../ui/buttons/link-button/LinkButton";
import PostInteractionButtons from "../post-interaction-buttons/PostInteractionButtons";
import PostInteractions from "./post-interactions/PostInteractions";
import PostHeader from "../post-header/PostHeader";

export default function PostItem({
    postMetaData,
    creatorDetails,
    userId,
    setTotalPosts,
    totalPosts,
}) {

    const [isLiked, setIsLiked] = useState(false);

    const onDeletePostClickHandler = async () => {
        const isDeleteCondirmed = confirm('Are you sure you want to delete this post?');

        if (!isDeleteCondirmed) {
            return totalPosts; // Returns totalPosts unnecessarily because eslint marks it as not used!
        }

        const deletedPostId = await postServices.handleDelete(postMetaData.id);

        setTotalPosts(totalPosts => totalPosts.filter(post => post._id !== deletedPostId))
    }

    const onLikePostClickHandler = async () => {
        await postServices.handleLike(userId, postMetaData.id);
        postMetaData.likes.push(userId);
        setIsLiked(true);
    }

    const onUnlikePostClockHandler = async () => {
        await postServices.handleUnlike(userId, postMetaData.id);
        postMetaData.likes = postMetaData.likes.filter(userLike => userLike !== userId);
        setIsLiked(false);
    }

    useEffect(() => {
        if (postMetaData?.likes.includes(userId)) {
            setIsLiked(true);
        }
    }, [postMetaData?.likes, userId])

    return <>
        <li className='post-item'>

            <PostHeader
                postId={postMetaData?.id}
                postedOn={postMetaData?.postedOn}
                imageUrl={creatorDetails?.imageUrl}
                ownerId={creatorDetails?.id}
                ownerFullName={creatorDetails?.fullName}
            />

            <div className='post-text'>{postMetaData?.text}</div>

            <PostInteractions
                comments={postMetaData?.comments}
                likes={postMetaData?.likes}
            />

            <div className='button-div'>
                <div>
                    {userId && (
                        <>
                            {(userId !== creatorDetails?.id &&
                                <PostInteractionButtons
                                    isLiked={isLiked}
                                    onLikeClickHandler={onLikePostClickHandler}
                                    onUnlikeClickHandler={onUnlikePostClockHandler}
                                />
                            )}

                            <LinkButton
                                urlLink={`/post/${postMetaData?.id}/details`}
                                btnStyle="button comment-btn"
                                buttonName="Comment"
                            />
                        </>
                    )}
                </div>
                <div>
                    {userId === creatorDetails?.id && (
                        <OwnerControls
                            urlLink={`/post/${postMetaData?.id}/edit`}
                            onDeleteClickHandler={onDeletePostClickHandler}
                        />
                    )}
                </div>
            </div>
        </li >
    </>
}