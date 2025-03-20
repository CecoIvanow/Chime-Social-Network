import FriendItem from "./friend-item/FriendItem";
import SearchField from "../../../ui/search-field/SearchField";

export default function FriendsSection() {
    return <>
        <div className="friends-section">
            <h2 className='friends-counter'>Friends (248)</h2>
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