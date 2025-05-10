import { useContext, useState } from "react"

import { PostContext } from "../../../../contexts/post-context";
import { LikesContext } from "../../../../contexts/likes-context";

import PostInteractionsAmount from "./post-interactions-amount/PostInteractionsAmount";
import PostButtons from "./post-buttons/PostButtons";

export default function PostInteractions() {

    const { post } = useContext(PostContext);

    const [likes, setLikes] = useState(post.likes || []);

    const likesContextValues = {
        likes,
        setLikes
    }

    return (
        <LikesContext.Provider value={likesContextValues}>
            <PostInteractionsAmount />

            <PostButtons />
        </ LikesContext.Provider >
    )
}