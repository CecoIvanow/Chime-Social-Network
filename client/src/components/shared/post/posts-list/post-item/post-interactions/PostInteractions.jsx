import {  useContext, useState } from "react"

import { PostContext } from "../../../../../../contexts/post-context";
import { LikesContext } from "../../../../../../contexts/likes-context";

import PostInteractionsAmount from "./post-interactions-amount/PostInteractionsAmount";
import PostButtons from "./post-buttons/PostButtons";

export default function PostInteractions({
    onDeletePostClickHandler
}) {

    const { post } = useContext(PostContext);

    const [likes, setLikes] = useState(post.likes || []);

    return (
        <LikesContext.Provider value={{ likes, setLikes }}>
            <PostInteractionsAmount />
            <PostButtons
                onDeletePostClickHandler={onDeletePostClickHandler}
            />
        </ LikesContext.Provider >
    )
}