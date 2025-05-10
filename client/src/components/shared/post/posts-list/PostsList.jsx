import { useContext, useEffect } from "react";

import PostItem from "./post-item/PostItem";

import { AlertContext } from "../../../../contexts/alert-context";
import { ActionsContext } from "../../../../contexts/actions-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";
import { UserContext } from "../../../../contexts/user-context";

import usePostServices from "../../../../hooks/usePostServices";

export default function PostsList() {
    const { totalPosts, setTotalPosts } = useContext(TotalPostsContext);
    const { setAlert } = useContext(AlertContext);
    const { isUser: currentUser } = useContext(UserContext);

    const { deletePost, likePost, unlikePost, abortAll } = usePostServices();

    useEffect(() => {
        return () => {
            abortAll()
        }
    }, [abortAll]);

    const onDeletePostClickHandler = async (postId) => {
        const isDeleteConFirmed = confirm('Are you sure you want to delete this post');

        if (!isDeleteConFirmed) {
            return;
        }

        try {
            const deletedPostId = await deletePost(postId);

            setTotalPosts(totalPosts => totalPosts.filter(post => post._id !== deletedPostId))
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const onUnlikeClickHandler = async (post) => {
        try {
            await unlikePost(currentUser, post._id);
            return true;
        } catch (error) {
            console.error(error);
            setAlert(error.message);
            return false;
        }
    }

    const onLikeClickHandler = async (post) => {
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
        onLikeClickHandler,
        onUnlikeClickHandler,
        onDeletePostClickHandler,
    }

    return <>
        {totalPosts?.map(post =>
            <ActionsContext.Provider
                value={actionsContextValues}
                key={post._id}
            >
                <PostItem
                    key={post._id}
                    postItem={post}
                />
            </ActionsContext.Provider>
        )}
    </>
}