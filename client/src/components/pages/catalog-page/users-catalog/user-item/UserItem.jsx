import { useContext, useState } from 'react'

import { UserContext } from '../../../../../contexts/user-context'

import Button from '../../../../ui/buttons/button/Button'
import UserItemDetails from './user-item-details/UserItemDetails'
import userServices from '../../../../../services/user-services';

export default function UserItem({
    user,
}) {
    const { isUser } = useContext(UserContext);

    const [isAddedAsFriend, setIsAddedAsFriend] = useState(user.friends?.includes(isUser));

    const onAddFriendClickHandler = async () => {
        await userServices.handleAddFriend(isUser, user._id);
        setIsAddedAsFriend(true);
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
                            onClickHandler={onAddFriendClickHandler}
                            buttonName='Unfriend'
                            btnStyle='button unfriend-btn'
                        />
                    ) : (
                        <Button
                            onClickHandler={onAddFriendClickHandler}
                            buttonName='Add'
                            btnStyle='button'
                        />
                    )}
                </>
            )}
        </div>
    </>
}