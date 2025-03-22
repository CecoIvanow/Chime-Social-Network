import SectionHeading from "../../../ui/headings/SectionHeading"
import SearchField from "../../../ui/search-field/SearchField"
import UserItem from "./user-item/UserItem"

export default function UsersCatalog({
    isUser,
    totalUsers,
    setUserSearchParams,
}) {
    return <>
        <div className="users-catalog">
            
            <SectionHeading
                sectionName='Registered Users:'
            />

            <SearchField
                setSearchParams={setUserSearchParams}
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