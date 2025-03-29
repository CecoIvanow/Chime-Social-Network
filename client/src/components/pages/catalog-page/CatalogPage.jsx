import { useEffect, useState } from "react";

import postServices from "../../../services/post-services";
import userServices from "../../../services/user-services";

import { TotalPostsContext } from "../../../contexts/total-posts-context";

import PostsCatalog from "./posts-catalog/PostsCatalog";
import UsersCatalog from "./users-catalog/UsersCatalog";


export default function CatalogPage() {

    const [userSearchParams, setUserSearchParams] = useState('');
    const [postSearchParams, setPostSearchParams] = useState('');

    const [totalPosts, setTotalPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState([]);
    const [matchingUsers, setMetchingUsers] = useState([]);
    const [matchingPosts, setMetchingPosts] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();

        const abortSignal = abortController.signal;

        userServices.handleGetAll(abortSignal)
            .then(data => setTotalUsers(data))
            .catch(error => console.error(error.message))

        return () => {
            abortController.abort();
        }
    }, [])

    useEffect(() => {
        console.log(totalUsers);
    }, [userSearchParams, totalUsers])

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

    return (
        <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
            <div className="dashboard-container">

                <PostsCatalog
                    setPostSearchParams={setPostSearchParams}
                />

                <UsersCatalog
                    totalUsers={totalUsers}
                    setUserSearchParams={setUserSearchParams}
                />
            </div>
        </TotalPostsContext.Provider>
    )
}