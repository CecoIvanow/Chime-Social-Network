import UserItem from "./user-item/UserItem";

export default function UsersList({
    matchingUsers
}) {
    return <>
        {matchingUsers.map(user =>
            <UserItem
                key={user._id}
                user={user}
            />
        )}
    </>
}