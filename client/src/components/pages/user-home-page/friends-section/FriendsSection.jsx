import { useContext } from "react";

import FriendItem from "./friend-item/FriendItem";
import SearchField from "../../../ui/search-field/SearchField";
import SectionHeading from "../../../ui/headings/SectionHeading";

import { FriendsContext } from "../../../../contexts/friends-context";

export default function FriendsSection() {
    const { userFriends } = useContext(FriendsContext);
    const friendsAmount = userFriends.length;

    return <>
        <div className="friends-section">

            <SectionHeading
                sectionName={`Friends (${friendsAmount}):`}
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