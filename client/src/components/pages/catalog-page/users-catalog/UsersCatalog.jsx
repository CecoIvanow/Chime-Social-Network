import { useEffect, useState } from "react";

import SectionHeading from "../../../ui/headings/SectionHeading"
import SearchField from "../../../ui/search-field/SearchField"

import UsersList from "./users-list/UsersList";
import LoadingSpinner from "../../../ui/loading-spinner/LoadingSpinner";

export default function UsersCatalog({
    totalUsers,
    isLoading
}) {
    const [userSearchParams, setUserSearchParams] = useState('');
    const [matchingUsers, setMatchingUsers] = useState([]);

    useEffect(() => {
        if (userSearchParams === '') {
            setMatchingUsers(totalUsers);
        } else {
            setMatchingUsers(
                totalUsers.filter(user => {
                    const matchByFirstName = user.firstName
                        .toLowerCase()
                        .includes(userSearchParams.toLowerCase());

                    const matchByLastName = user.lastName
                        .toLowerCase()
                        .includes(userSearchParams.toLowerCase());

                    if (matchByFirstName || matchByLastName) {
                        return true;
                    }
                })
            )
        }
    }, [userSearchParams, totalUsers])

    return <>
        <div className="users-catalog">

            <SectionHeading
                sectionName='Registered Users:'
            />

            <SearchField
                setSearchParams={setUserSearchParams}
                searchBy={'name'}
            />

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <UsersList
                    matchingUsers={matchingUsers}
                />
            )}

        </div>
    </>
}