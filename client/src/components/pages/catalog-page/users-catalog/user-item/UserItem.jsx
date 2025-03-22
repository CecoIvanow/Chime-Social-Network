import Button from '../../../../ui/buttons/button/Button'
import UserItemDetails from './user-item-details/UserItemDetails'

export default function UserItem({
    user,
    isUser,
}) {
    return <>
        <div className="user-item">
            <UserItemDetails
                user={user}
            />

            {(isUser && isUser !== user._id) && (
                <Button
                    buttonName='Add'
                    btnStyle='button'
                />
            )}
        </div>
    </>
}