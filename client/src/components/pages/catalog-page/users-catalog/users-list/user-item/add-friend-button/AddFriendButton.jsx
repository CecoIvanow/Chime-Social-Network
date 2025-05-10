import Button from "../../../../../../ui/buttons/button/Button";

export default function AddFriendButton({
    isAddedAsFriend,
    handleUnfriendClick,
    handleAddFriendClick,
}) {
    return <>
        {isAddedAsFriend ? (
            <Button
                onClickHandler={handleUnfriendClick}
                buttonName='Unfriend'
                btnStyle='button unfriend-btn'
            />
        ) : (
            <Button
                onClickHandler={handleAddFriendClick}
                buttonName='Add'
                btnStyle='button'
            />
        )}
    </>
}