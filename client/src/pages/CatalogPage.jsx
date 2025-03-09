import PostItem from "../components/PostItem";
import SearchField from "../components/SearchField";
import UserItem from "../components/UserItem";

export default function CatalogPage() {
    return <>
        <div className="dashboard-container">
            {/* <!-- Posts Catalog --> */}
            <div className="posts-catalog">
                <h2 className="section-heading">All Posts (1,234)</h2>
                <SearchField />

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
                <SearchField />

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