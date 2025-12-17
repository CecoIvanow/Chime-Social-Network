import { useEffect, useState } from "react";

import SearchField from "../../../ui/search-field/SearchField";
import SectionHeading from "../../../ui/headings/SectionHeading";
import FriendsList from "./friends-list/FriendsList";
import LoadingSpinner from "../../../ui/loading-spinner/LoadingSpinner";

export default function FriendsSection({
    userFriends = [],
    isLoading,
}) {
    const friendsAmount = userFriends.length;

    const [friendSearchParams, setFriendSearchParams] = useState('');
    const [matchingFriends, setMatchingFriends] = useState([]);

    useEffect(() => {
        if (matchingFriends.length === userFriends.length) {
            return;
        } else if (friendSearchParams === '') {
            setMatchingFriends(userFriends);
        } else {
            setMatchingFriends(
                userFriends.filter(user => {
                    const matchByFirstName = user.firstName
                        .toLowerCase()
                        .includes(friendSearchParams.toLowerCase());

                    const matchByLastName = user.lastName
                        .toLowerCase()
                        .includes(friendSearchParams.toLowerCase());

                    if (matchByFirstName || matchByLastName) {
                        return true;
                    }
                })
            )
        }
    }, [friendSearchParams, userFriends, matchingFriends.length])

    return <>
        <div className="friends-section">

            <SectionHeading
                sectionName={`Friends (${friendsAmount}):`}
            />

            <SearchField
                setSearchParams={setFriendSearchParams}
                searchBy={'name'}
            />

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <FriendsList
                    matchingFriends={matchingFriends}
                />
            )}

        </div >
    </>
}