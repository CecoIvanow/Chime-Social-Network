export default function FriendItem({
    friend,
    onClickHandler,
}) {
    return <>
        <li className='friend-item' onClick={onClickHandler}>
            <img src={friend.imageUrl} alt="" />
            {friend.firstName} {friend.lastName}
        </li>
    </>
}