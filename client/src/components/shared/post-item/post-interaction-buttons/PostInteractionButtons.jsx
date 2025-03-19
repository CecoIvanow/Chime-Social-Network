import Button from "../../../ui/buttons/button/Button"

export default function PostInteractionButtons({
    isLiked,
    onLikeClickHandler,
    onUnlikeClickHandler,
}) {
    return <>
        {isLiked ? (
            <Button
                onClickHandler={onUnlikeClickHandler}
                btnStyle="button unlike-btn"
                buttonName="Unlike"
            />
        ) : (
            <Button
                onClickHandler={onLikeClickHandler}
                btnStyle="button "
                buttonName="Like"
            />
        )}
    </>
}