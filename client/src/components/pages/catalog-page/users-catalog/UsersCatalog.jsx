import SearchField from "../../../shared/search-field/SearchField"
import UserItem from "../user-item/UserItem"

export default function UsersCatalog({
    isUser,
    totalUsers,
    setUserSearchParam,
}) {
    return <>
        <div className="users-catalog">
            <h2 className="section-heading">Registered Users:</h2>

            <SearchField
                setSearchParams={setUserSearchParam}
                searchBy={'name'}
            />

            {/* <!-- User Items --> */}
            {totalUsers.map(user =>
                <UserItem
                    key={user._id}
                    profileId={user._id}
                    isUser={isUser}
                    imageUrl={user.imageUrl}
                    postsAmount={user.createdPosts.length}
                    memberSince={user.memberSince}
                    firstName={user.firstName}
                    lastName={user.lastName}
                />
            )}

        </div>
    </>
}