import SearchField from "../../../ui/search-field/SearchField";
import SectionHeading from "../../../ui/headings/SectionHeading";
import FriendsList from "./friends-list/FriendsList";
import LoadingSpinner from "../../../ui/loading-spinner/LoadingSpinner";

export default function FriendsSection({
    userFriends = [],
    isLoading,
}) {
    const friendsAmount = userFriends.length;

    return <>
        <div className="friends-section">

            <SectionHeading
                sectionName={`Friends (${friendsAmount}):`}
            />

            <SearchField
            />

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <FriendsList
                    userFriends={userFriends}
                />
            )}

        </div >
    </>
}