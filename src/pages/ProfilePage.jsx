import MenuBar from "../components/MenuBar";

export default function ProfilePage() {
    return <>
        <MenuBar />

        <div className="profile-container">
            <div className="profile-info-section">
                <div className="profile-header">
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" className="profile-avatar" alt="Profile picture" />
                    <div className="profile-details">
                        <h2>John Doe</h2>
                        <p><h4>Some random bio about the user which might or might not be important, dunno, just testing atm</h4></p>
                        <p>New York, USA</p>
                        <p>27 years old</p>
                        <p>Web Developer</p>
                        <p>Harvard University</p>
                        <p>Single</p>
                        <p>Joined February 2025</p>
                        <a href="/edit"><button className="edit-profile-btn">Edit Profile</button></a>
                    </div>
                </div>
            </div>

            <div className="posts-section">
                <h2 className="posts-heading">My Posts (23)</h2>

                <div className="post-item">
                    <div className="post-header">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" className="post-author-img" alt="User avatar" />                            <div>
                            <div className="post-date">Posted 2 hours ago</div>
                        </div>
                    </div>
                    <div className="post-content">
                        Just climbed Mount Everest! What an incredible experience! Can&apos;t wait to share more photos soon.
                    </div>
                    <div className="post-actions">
                        <button className="post-button edit-btn">Edit</button>
                        <button className="post-button delete-btn">Delete</button>
                    </div>
                </div>

                <div className="post-item">
                    <div className="post-header">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" className="post-author-img" alt="User avatar" />                            <div>
                            <div className="post-date">Posted 2 hours ago</div>
                        </div>
                    </div>
                    <div className="post-content">
                        Just climbed Mount Everest! What an incredible experience! Can&apos;t wait to share more photos soon.
                    </div>
                    <div className="post-actions">
                        <button className="post-button edit-btn">Edit</button>
                        <button className="post-button delete-btn">Delete</button>
                    </div>
                </div>

                <div className="post-item">
                    <div className="post-header">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" className="post-author-img" alt="User avatar" />                            <div>
                            <div className="post-date">Posted 2 hours ago</div>
                        </div>
                    </div>
                    <div className="post-content">
                        Just climbed Mount Everest! What an incredible experience! Can&apos;t wait to share more photos soon.
                    </div>
                    <div className="post-actions">
                        <button className="post-button edit-btn">Edit</button>
                        <button className="post-button delete-btn">Delete</button>
                    </div>
                </div>

                <div className="post-item">
                    <div className="post-header">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" className="post-author-img" alt="User avatar" />                            <div>
                            <div className="post-date">Posted 2 hours ago</div>
                        </div>
                    </div>
                    <div className="post-content">
                        Just climbed Mount Everest! What an incredible experience! Can&apos;t wait to share more photos soon.
                    </div>
                    <div className="post-actions">
                        <button className="post-button edit-btn">Edit</button>
                        <button className="post-button delete-btn">Delete</button>
                    </div>
                </div>

                <div className="post-item">
                    <div className="post-header">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" className="post-author-img" alt="User avatar" />                            <div>
                            <div className="post-date">Posted 2 hours ago</div>
                        </div>
                    </div>
                    <div className="post-content">
                        Just climbed Mount Everest! What an incredible experience! Can&apos;t wait to share more photos soon.
                    </div>
                    <div className="post-actions">
                        <button className="post-button edit-btn">Edit</button>
                        <button className="post-button delete-btn">Delete</button>
                    </div>
                </div>

            </div>
        </div>
    </>
}