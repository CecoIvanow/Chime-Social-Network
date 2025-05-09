import { useContext, useEffect } from "react";

import Button from "../../../../../../ui/buttons/button/Button"

import { AlertContext } from "../../../../../../../contexts/alert-context";
import { UserContext } from "../../../../../../../contexts/user-context";
import { PostContext } from "../../../../../../../contexts/post-context";
import { LikesContext } from "../../../../../../../contexts/likes-context";

import usePostServices from "../../../../../../../hooks/usePostServices";

export default function PostLikeButtons() {
    const { post } = useContext(PostContext);
    const { isUser } = useContext(UserContext)
    const { setAlert } = useContext(AlertContext);
    const { likes, setLikes } = useContext(LikesContext);

    const { likePost, unlikePost, abortAll } = usePostServices();

    const isLiked = likes.includes(isUser);

    useEffect(() => {
        return () => {
            abortAll();
        }
    }, [abortAll])

    const onLikeClickHandler = async () => {
        try {
            await likePost(isUser, post._id);
            setLikes(localLikes => [...localLikes, isUser]);
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const onUnlikeClickHandler = async () => {
        try {
            await unlikePost(isUser, post._id);
            setLikes(localLikes => localLikes.filter(userLike => userLike !== isUser));
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    return <>
        {isLiked ? (
            <Button
                key="unlike"
                onClickHandler={onUnlikeClickHandler}
                btnStyle="button unlike-btn"
                buttonName="Unlike"
            />
        ) : (
            <Button
                key="like"
                onClickHandler={onLikeClickHandler}
                btnStyle="button "
                buttonName="Like"
            />
        )}
    </>
}