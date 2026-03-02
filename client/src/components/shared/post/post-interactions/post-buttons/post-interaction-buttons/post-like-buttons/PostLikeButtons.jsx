import { useContext } from "react";

import Button from "../../../../../../ui/buttons/button/Button";

import { PostContext } from "../../../../../../../contexts/post-context";
import { UserContext } from "../../../../../../../contexts/user-context";
import { LikesContext } from "../../../../../../../contexts/likes-context";
import { ActionsContext } from "../../../../../../../contexts/actions-context";

export default function PostLikeButtons() {
    const { post } = useContext(PostContext);
    const { loggedInUserId } = useContext(UserContext)
    const { likes, setLikes } = useContext(LikesContext);
    const { onLikeClickHandler, onUnlikeClickHandler } = useContext(ActionsContext);

    const isLiked = likes.includes(loggedInUserId);

    const handleLikeClick = async () => {
        const isSuccessfull = await onLikeClickHandler(post);

        if (isSuccessfull) {
            setLikes(likes => [...likes, loggedInUserId]);
        }
    }

    const handleUnlikeClick = async () => {
        const isSuccessfull = await onUnlikeClickHandler(post);

        if (isSuccessfull) {
            setLikes(likes => likes.filter(userLike => userLike !== loggedInUserId));
        }
    }

    return <>
        {isLiked ? (
            <Button
                key="unlike"
                onClickHandler={handleUnlikeClick}
                btnStyle="button unlike-btn"
                buttonName="Unlike"
            />
        ) : (
            <Button
                key="like"
                onClickHandler={handleLikeClick}
                btnStyle="button "
                buttonName="Like"
            />
        )}
    </>
}