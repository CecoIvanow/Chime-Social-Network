import FriendItem from "./friend-item/FriendItem";
import SearchField from "../../../ui/search-field/SearchField";
import SectionHeading from "../../../ui/headings/SectionHeading";

export default function FriendsSection() {
    return <>
        <div className="friends-section">

            <SectionHeading
                sectionName='Friends (248):'
            />

            <SearchField />
            <div className='friends-list'>
                <FriendItem />
                <FriendItem />
                <FriendItem />
                <FriendItem />
                <FriendItem />
                <FriendItem />
                <FriendItem />
                <FriendItem />
            </div>
        </div >
    </>
}