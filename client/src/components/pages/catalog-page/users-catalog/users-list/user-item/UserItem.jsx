import { useContext, useState } from 'react'

import UserItemDetails from './user-item-details/UserItemDetails';
import Button from '../../../../../ui/buttons/button/Button';

import { UserContext } from '../../../../../../contexts/user-context'

export default function UserItem({
    user,
    handleAddFriend,
    handleRemoveFriend,
}) {
    const { isUser } = useContext(UserContext);

    const [isAddedAsFriend, setIsAddedAsFriend] = useState(user.friends?.includes(isUser));

    const handleUnfriendClick = async () => {
        const isSuccessfull = await handleRemoveFriend(user);

        if (isSuccessfull) {
            setIsAddedAsFriend(false);
        }
    }

    const handleAddFriendClick = async () => {
        const isSuccessfull = await handleAddFriend(user)

        if (isSuccessfull) {
            setIsAddedAsFriend(true);
        }
    }

    return <>
        <div className="user-item">
            <UserItemDetails
                user={user}
            />

            {(isUser && isUser !== user._id) && (
                <>
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
            )}
        </div>
    </>
}