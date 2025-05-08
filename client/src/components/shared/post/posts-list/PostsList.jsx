import { useContext } from "react";

import PostItem from "./post-item/PostItem";

import { TotalPostsContext } from "../../../../contexts/total-posts-context";

export default function PostsList() {

    const { totalPosts } = useContext(TotalPostsContext);

    return <>
        {totalPosts?.map(post =>
            <PostItem
                key={post._id}
                postItem={post}
            />
        )}
    </>
}