import SectionHeading from "../../../ui/headings/SectionHeading"
import SearchField from "../../../ui/search-field/SearchField"
import UserItem from "./user-item/UserItem"

export default function UsersCatalog({
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

            {totalUsers.map(user =>
                <UserItem
                    key={user._id}
                    user={user}
                />
            )}

        </div>
    </>
}