import { useContext, useState } from "react"

import { PostContext } from "../../../../../../contexts/post-context";
import { LikesContext } from "../../../../../../contexts/likes-context";

import PostInteractionsAmount from "./post-interactions-amount/PostInteractionsAmount";
import PostButtons from "./post-buttons/PostButtons";

export default function PostInteractions({
    isEditClicked,
    onDeletePostClickHandler,
    onEditPostClickHandler,
    onSaveEditClickHandler,
    onCancelEditClickHandler
}) {

    const { post } = useContext(PostContext);

    const [likes, setLikes] = useState(post.likes || []);

    return (
        <LikesContext.Provider value={{ likes, setLikes }}>
            <PostInteractionsAmount />
            <PostButtons
                isEditClicked={isEditClicked}
                onDeletePostClickHandler={onDeletePostClickHandler}
                onEditPostClickHandler={onEditPostClickHandler}
                onSaveEditClickHandler={onSaveEditClickHandler}
                onCancelEditClickHandler={onCancelEditClickHandler}
            />
        </ LikesContext.Provider >
    )
}