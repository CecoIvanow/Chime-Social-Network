import { useContext, useEffect, useState } from "react";

import SectionHeading from "../../../ui/headings/SectionHeading"
import SearchField from "../../../ui/search-field/SearchField"
import UserItem from "./user-item/UserItem"

import { AlertContext } from "../../../../contexts/alert-context";

import useUserServices from "../../../../hooks/useUserServices";

export default function UsersCatalog() {

    const [userSearchParams, setUserSearchParams] = useState('');
    const [totalUsers, setTotalUsers] = useState([]);
    const [matchingUsers, setMatchingUsers] = useState([]);

    const { setAlert } = useContext(AlertContext);

    const { getAllUsers } = useUserServices();

    useEffect(() => {
        getAllUsers()
            .then(data => setTotalUsers(data))
            .catch(error => {
                console.error(error);
                setAlert(error.message);
            })
    }, [setAlert, getAllUsers]);

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

            {matchingUsers.map(user =>
                <UserItem
                    key={user._id}
                    user={user}
                />
            )}

        </div>
    </>
}