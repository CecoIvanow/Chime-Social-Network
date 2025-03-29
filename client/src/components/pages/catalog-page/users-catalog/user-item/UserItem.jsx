import { useContext } from 'react'

import { UserContext } from '../../../../../contexts/user-context'

import Button from '../../../../ui/buttons/button/Button'
import UserItemDetails from './user-item-details/UserItemDetails'

export default function UserItem({
    user,
}) {
    const { isUser } = useContext(UserContext);

    const onAddFriendClickHandler = () => {
        alert('Hello');
    }

    return <>
        <div className="user-item">
            <UserItemDetails
                user={user}
            />

            {(isUser && isUser !== user._id) && (
                <Button
                    onClickHandler={onAddFriendClickHandler}
                    buttonName='Add'
                    btnStyle='button'
                />
            )}
        </div>
    </>
}