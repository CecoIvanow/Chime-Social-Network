import { useEffect, useState } from "react";

import PostsCatalog from "./posts-catalog/PostsCatalog";
import UsersCatalog from "./users-catalog/UsersCatalog";

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

            <PostsCatalog
                isUser={isUser}
                totalPosts={totalPosts}
                setTotalPosts={setTotalPosts}
                setPostSearchParams={setPostSearchParams}
            />

            <UsersCatalog
                isUser={isUser}
                totalUsers={totalUsers}
                setUserSearchParam={setUserSearchParam}
            />
        </div>
    </>
}