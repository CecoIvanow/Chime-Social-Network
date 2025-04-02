import { useContext, useEffect, useState } from "react";

import SectionHeading from "../../../ui/headings/SectionHeading"
import SearchField from "../../../ui/search-field/SearchField"

import { AlertContext } from "../../../../contexts/alert-context";

import useUserServices from "../../../../hooks/useUserServices";
import UsersList from "./users-list/UsersList";
import LoadingSpinner from "../../../ui/loading-spinner/LoadingSpinner";

export default function UsersCatalog() {

    const [userSearchParams, setUserSearchParams] = useState('');
    const [totalUsers, setTotalUsers] = useState([]);
    const [matchingUsers, setMatchingUsers] = useState([]);

    const { setAlert } = useContext(AlertContext);

    const { getAllUsers, isLoading } = useUserServices();

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