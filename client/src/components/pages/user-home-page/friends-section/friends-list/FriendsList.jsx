import FriendItem from "./friend-item/FriendItem";

export default function FriendsList({
    userFriends,
}) {
    return <>
        <div className='friends-list'>
            {userFriends.map(friend =>
                <FriendItem
                    key={friend._id}
                    friend={friend}
                />
            )}
        </div>
    </>
}