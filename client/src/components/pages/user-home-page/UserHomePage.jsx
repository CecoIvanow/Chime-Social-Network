import CreatePostItem from "../../shared/create-post-field/CreatePostField";
import FriendItem from "./friend-item/FriendItem";
import PostItem from "../../shared/post-item/PostItem";
import SearchField from "../../shared/search-field/SearchField";

export default function UserHomePage({
    isUser: userId
}) {
    return <>
        <div className='user-home-page'>
            <div className="profile-section">
                <div className='profile-user-avatar'>
                    <img className='profile-picture' src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                </div>
                <div className="profile-info">
                    <h2>John Doe</h2>
                    <p><span className="info-label">Bio:</span> Some random bio about the user which might or might not be important, currently in testing phase</p>
                    <p><span className="info-label">Location:</span> New York, USA</p>
                    <p><span className="info-label">Age:</span> 27 years</p>
                    <p><span className="info-label">Occupation:</span> Web Developer</p>
                    <p><span className="info-label">Education:</span> Harvard University</p>
                    <p><span className="info-label">Status:</span> Single</p>
                    <p><span className="info-label">Member Since:</span> February 2025</p>
                </div>
            </div>

            <div className="posts-section">
                <CreatePostItem
                    userId={userId}
                />
                <div className='posts-list'>
                    <PostItem />
                    <PostItem />
                    <PostItem />
                    <PostItem />
                </div>
            </div>

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
            </div>
        </div>
    </>
}