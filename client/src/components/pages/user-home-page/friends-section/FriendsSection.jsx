import FriendItem from "./friend-item/FriendItem";
import SearchField from "../../../ui/search-field/SearchField";
import SectionHeading from "../../../ui/headings/SectionHeading";


export default function FriendsSection({
    userFriends
}) {
    const friendsAmount = userFriends.length;

    return <>
        <div className="friends-section">

            <SectionHeading
                sectionName={`Friends (${friendsAmount}):`}
            />

            <SearchField />
            <div className='friends-list'>
                {userFriends.map(friend =>
                    <FriendItem />
                )}
            </div>
        </div >
    </>
}