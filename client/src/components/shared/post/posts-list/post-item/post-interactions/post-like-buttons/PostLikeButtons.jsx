import { useContext } from "react";

import Button from "../../../../../../ui/buttons/button/Button"

import { UserContext } from "../../../../../../../contexts/user-context";
import { LikesContext } from "../../../../../../../contexts/likes-context";
import { PostContext } from "../../../../../../../contexts/post-context";

export default function PostLikeButtons({
    onLikeClickHandler,
    onUnlikeClickHandler,
}) {
    const { isUser } = useContext(UserContext)
    const { likes, setLikes } = useContext(LikesContext);
    const { post } = useContext(PostContext);

    const isLiked = likes.includes(isUser);

    const handleLikeClick = async () => {
        const isSuccessfull = await onLikeClickHandler(post);

        if (isSuccessfull) {
            setLikes(likes => [...likes, isUser]);
        }
    }

    const handleUnlikeClick = async () => {
        const isSuccessfull = await onUnlikeClickHandler(post);

        if (isSuccessfull) {
            setLikes(likes => likes.filter(userLike => userLike !== isUser));
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