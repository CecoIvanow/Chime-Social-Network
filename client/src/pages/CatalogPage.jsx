import PostItem from "../components/PostItem";
import UserItem from "../components/UserItem";

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
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
                <UserItem />
            </div>
        </div>
    </>
}