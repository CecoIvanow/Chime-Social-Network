import { useEffect, useState } from "react";

import PostItem from "../components/PostItem";
import SearchField from "../components/SearchField";
import UserItem from "../components/UserItem";
import postServices from "../services/post-services";
import userServices from "../services/user-services";

export default function CatalogPage({
    isUser
}) {
    const [allPosts, setAllPosts] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        postServices.handleGetAllWithOwners()
            .then(data => setAllPosts(data))
            .catch(error => console.error(error.message));

        userServices.handleGetAll()
            .then(data => setAllUsers(data))
            .catch(error => console.error(error.message));
    }, [])

    return <>
        <div className="dashboard-container">
            {/* <!-- Posts Catalog --> */}
            <div className="posts-catalog">
                <h2 className="section-heading">All Posts:</h2>
                <SearchField />

                {/* <!-- Post Items --> */}
                {console.log(allPosts)}
                {allPosts.map(post =>
                    <PostItem
                        key={post._id}
                        ownerId={post.owner._id}
                        isUser={isUser}
                        text={post.text}
                        postedOn={post.postedOn}
                        imageUrl={post.owner.imageUrl}
                        fullName={`${post.owner.firstName} ${post.owner.lastName}`}
                    />
                )}
            </div>

            {/* <!-- Users Catalog --> */}
            <div className="users-catalog">
                <h2 className="section-heading">Registered Users:</h2>
                <SearchField />

                {/* <!-- User Items --> */}
                {allUsers.map(user =>
                    <UserItem
                        key={user._id}
                        profileId={user._id}
                        isUser={isUser}
                        imageUrl={user.imageUrl}
                        postsAmount={user.createdPosts.length}
                        memberSince={user.memberSince}
                        firstName={user.firstName}
                        lastName={user.lastName}
                    />
                )}

            </div>
        </div>
    </>
}