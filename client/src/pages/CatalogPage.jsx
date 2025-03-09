import PostItem from "../components/PostItem";

export default function CatalogPage() {
    return <>
        <div className="dashboard-container">
            {/* <!-- Posts Catalog --> */}
            <div className="posts-catalog">
                <h2 className="section-heading">All Posts (1,234)</h2>
                <div className="search-filter">
                    <input type="text" className="search-input" placeholder="Search posts..." />
                </div>

                {/* <!-- Post Items --> */}
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
            </div>

            {/* <!-- Users Catalog --> */}
            <div className="users-catalog">
                <h2 className="section-heading">Registered Users (5,678)</h2>
                <div className="search-filter">
                    <input type="text" className="search-input" placeholder="Search users..." />
                </div>

                {/* <!-- User Items --> */}
                <div className="user-item">
                    <img src="https://randomuser.me/api/portraits/women/1.jpg" className="user-avatar" alt="User avatar" />
                    <div className="user-info">
                        <div className="user-name">Jane Smith</div>
                        <div className="user-details">
                            <div>Joined: Feb 2024</div>
                            <div>Posts: 45</div>
                        </div>
                    </div>
                    <button className="action-button">Add</button>
                </div>
                <div className="user-item">
                    <img src="https://randomuser.me/api/portraits/women/1.jpg" className="user-avatar" alt="User avatar" />
                    <div className="user-info">
                        <div className="user-name">Jane Smith</div>
                        <div className="user-details">
                            <div>Joined: Feb 2024</div>
                            <div>Posts: 45</div>
                        </div>
                    </div>
                    <button className="action-button">Add</button>
                </div>
                <div className="user-item">
                    <img src="https://randomuser.me/api/portraits/women/1.jpg" className="user-avatar" alt="User avatar" />
                    <div className="user-info">
                        <div className="user-name">Jane Smith</div>
                        <div className="user-details">
                            <div>Joined: Feb 2024</div>
                            <div>Posts: 45</div>
                        </div>
                    </div>
                    <button className="action-button">Add</button>
                </div>
                <div className="user-item">
                    <img src="https://randomuser.me/api/portraits/women/1.jpg" className="user-avatar" alt="User avatar" />
                    <div className="user-info">
                        <div className="user-name">Jane Smith</div>
                        <div className="user-details">
                            <div>Joined: Feb 2024</div>
                            <div>Posts: 45</div>
                        </div>
                    </div>
                    <button className="action-button">Add</button>
                </div>
                <div className="user-item">
                    <img src="https://randomuser.me/api/portraits/women/1.jpg" className="user-avatar" alt="User avatar" />
                    <div className="user-info">
                        <div className="user-name">Jane Smith</div>
                        <div className="user-details">
                            <div>Joined: Feb 2024</div>
                            <div>Posts: 45</div>
                        </div>
                    </div>
                    <button className="action-button">Add</button>
                </div>
            </div>
        </div>
    </>
}