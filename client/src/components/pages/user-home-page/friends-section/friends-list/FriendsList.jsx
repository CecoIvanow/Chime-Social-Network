import FriendItem from "./friend-item/FriendItem";

export default function FriendsList({
    matchingFriends,
}) {
    return <>
        <div className='friends-list'>
            {matchingFriends.map(friend =>
                <FriendItem
                    key={friend._id}
                    friend={friend}
                />
            )}
        </div>
    </>
}