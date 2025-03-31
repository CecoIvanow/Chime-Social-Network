import SectionHeading from "../../../ui/headings/SectionHeading"
import SearchField from "../../../ui/search-field/SearchField"
import UserItem from "./user-item/UserItem"

export default function UsersCatalog({
    matchingUsers,
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

            {matchingUsers.map(user =>
                <UserItem
                    key={user._id}
                    user={user}
                />
            )}

        </div>
    </>
}