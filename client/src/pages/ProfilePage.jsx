export default function ProfilePage() {
    return <>
        <div className="profile-container">
            <div className="profile-info-section">
                <div className="profile-header">
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" className="profile-avatar" alt="Profile picture" />
                    <div className="profile-info">
                        <h2>John Doe</h2>
                        <p><span className="info-label">Bio:</span> Some random bio about the user which might or might not be important, currently in testing phase</p>
                        <p><span className="info-label">Location:</span> New York, USA</p>
                        <p><span className="info-label">Age:</span> 27 years</p>
                        <p><span className="info-label">Occupation:</span> Web Developer</p>
                        <p><span className="info-label">Education:</span> Harvard University</p>
                        <p><span className="info-label">Status:</span> Single</p>
                        <p><span className="info-label">Member Since:</span> February 2025</p>
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