import { useEffect, useState } from "react";

import PostItem from "../components/PostItem";
import SearchField from "../components/SearchField";
import UserItem from "../components/UserItem";
import postServices from "../services/post-services";

export default function CatalogPage({
    isUser
}) {
    const [allPosts, setAllPosts] = useState([]);

    useEffect(() => {
        postServices.handleGetAllPosts()
            .then(data => setAllPosts(data))
            .catch(error => console.error(error.message));
    }, [])

    return <>
        <div className="dashboard-container">
            {/* <!-- Posts Catalog --> */}
            <div className="posts-catalog">
                <h2 className="section-heading">All Posts (1,234)</h2>
                <SearchField />

                {/* <!-- Post Items --> */}
                {allPosts.map(post =>
                    <PostItem
                        ownerId={post.owner}
                        isUser={isUser}
                        key={post._id}
                        text={post.text}
                        postedOn={post.postedOn}
                    />
                )}
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