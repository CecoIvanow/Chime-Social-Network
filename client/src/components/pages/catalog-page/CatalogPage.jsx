import { useEffect, useState } from "react";

import PostItem from "../../shared/post-item/PostItem";
import SearchField from "../../shared/search-field/SearchField";
import UserItem from "./user-item/UserItem";
import postServices from "../../../services/post-services";
import userServices from "../../../services/user-services";

export default function CatalogPage({
    isUser
}) {

    const [userSearchParam, setUserSearchParam] = useState('');
    const [postSearchParams, setPostSearchParams] = useState('');

    const [totalPosts, setTotalPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();

        const abortSignal = abortController.signal;

        userServices.handleGetAllWithMatchingNames(userSearchParam, abortSignal)
            .then(data => setTotalUsers(data))
            .catch(error => console.error(error.message))

        return () => {
            abortController.abort();
        }
    }, [userSearchParam])

    useEffect(() => {
        const abortController = new AbortController();

        const abortSignal = abortController.signal;

        postServices.handleGetAllByContentWithOwners(postSearchParams, abortSignal)
            .then(data => setTotalPosts(data))
            .catch(error => console.error(error.message))

        return () => {
            abortController.abort();
        }
    }, [postSearchParams])

    return <>
        <div className="dashboard-container">
            {/* <!-- Posts Catalog --> */}
            <div className="posts-catalog">
                <h2 className="section-heading">All Posts:</h2>
                <SearchField
                    setSearchParams={setPostSearchParams}
                    searchBy={'text'}
                />

                {/* <!-- Post Items --> */}
                {totalPosts.map(post => {
                    const postMetaData = {
                        id: post._id,
                        text: post.text,
                        postedOn: post.postedOn,
                        likes: post.likes,
                        comments: post.comments
                    }

                    const creatorDetails = {
                        id: post.owner._id,
                        imageUrl: post.owner.imageUrl,
                        fullName: `${post.owner.firstName} ${post.owner.lastName}`,
                    }

                    return <PostItem
                        key={post._id}
                        postMetaData={postMetaData}
                        creatorDetails={creatorDetails}
                        userId={isUser}
                        setTotalPosts={setTotalPosts}
                        totalPosts={totalPosts}
                    />
                })}
            </div>

            {/* <!-- Users Catalog --> */}
            <div className="users-catalog">
                <h2 className="section-heading">Registered Users:</h2>
                <SearchField
                    setSearchParams={setUserSearchParam}
                    searchBy={'name'}
                />

                {/* <!-- User Items --> */}
                {totalUsers.map(user =>
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