import { useContext, useState } from 'react'

import { UserContext } from '../../../../../contexts/user-context'
import { AlertContext } from '../../../../../contexts/alert-context';

import Button from '../../../../ui/buttons/button/Button'
import UserItemDetails from './user-item-details/UserItemDetails'

import userServices from '../../../../../services/user-services';

export default function UserItem({
    user,
}) {
    const { isUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);

    const [isAddedAsFriend, setIsAddedAsFriend] = useState(user.friends?.includes(isUser));

    const onAddFriendClickHandler = async () => {
        try {
            await userServices.handleAddFriend(isUser, user._id, {});
            setIsAddedAsFriend(true);
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    const onUnfriendClickHandler = async () => {
        try {
            await userServices.handleUnfriend(isUser, user._id, {});
            setIsAddedAsFriend(false);
        } catch (error) {
            console.error(error);
            setAlert(error.message);
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
                            onClickHandler={onUnfriendClickHandler}
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