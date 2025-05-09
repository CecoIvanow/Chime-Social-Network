import { useContext, useState } from "react";

import PostHeader from "../../post-header/PostHeader";
import PostInteractions from "./post-interactions/PostInteractions";
import PostText from "../../../../pages/post-details-page/post-text/PostText";

import { PostContext } from "../../../../../contexts/post-context";
import { AlertContext } from "../../../../../contexts/alert-context";
import { TotalPostsContext } from "../../../../../contexts/total-posts-context"

import usePostServices from "../../../../../hooks/usePostServices";

export default function PostItem({
    postItem,
}) {
    const [post, setPost] = useState(postItem);

    const { totalPosts, setTotalPosts } = useContext(TotalPostsContext);
    const { setAlert } = useContext(AlertContext);

    const { deletePost } = usePostServices();

    if (!post?._id) {
        return null;
    }


    const onDeletePostClickHandler = async () => {
        const isDeleteConFirmed = confirm('Are you sure you want to delete this post');

        if (!isDeleteConFirmed) {
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

    return (
        <PostContext.Provider value={{ post, setPost }}>
            <li className='post-item'>

                <PostHeader />

                <PostText
                    postText={post.text}
                />

                <PostInteractions
                    onDeletePostClickHandler={onDeletePostClickHandler}
                />
            </li >
        </PostContext.Provider>
    )
}