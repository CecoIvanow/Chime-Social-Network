import { useContext, useEffect, useState } from "react";

import postServices from "../../../services/post-services";
import userServices from "../../../services/user-services";

import { TotalPostsContext } from "../../../contexts/total-posts-context";

import PostsCatalog from "./posts-catalog/PostsCatalog";
import UsersCatalog from "./users-catalog/UsersCatalog";
import { AlertContext } from "../../../contexts/alert-context";


export default function CatalogPage() {

    const [userSearchParams, setUserSearchParams] = useState('');
    const [postSearchParams, setPostSearchParams] = useState('');

    const [totalPosts, setTotalPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState([]);
    const [matchingUsers, setMatchingUsers] = useState([]);
    const [matchingPosts, setMatchingPosts] = useState([]);

    const { setAlert } = useContext(AlertContext);

    useEffect(() => {
        const abortController = new AbortController();

        const abortSignal = abortController.signal;

        userServices.handleGetAll({ abortSignal, setAlert })
            .then(data => setTotalUsers(data))
            .catch(error => console.error(error.message))

        postServices.handleGetAll(abortSignal)
            .then(data => setTotalPosts(data))
            .catch(error => console.error(error.message))

        return () => {
            abortController.abort();
        }
    }, [setAlert]);

    useEffect(() => {
        if (userSearchParams === '') {
            setMatchingUsers(totalUsers);
        } else {
            setMatchingUsers(
                totalUsers.filter(user => {
                    const matchByFirstName = user.firstName
                        .toLowerCase()
                        .includes(userSearchParams.toLowerCase());

                    const matchByLastName = user.lastName
                        .toLowerCase()
                        .includes(userSearchParams.toLowerCase());

                    if (matchByFirstName || matchByLastName) {
                        return true;
                    }
                })
            )
        }
    }, [userSearchParams, totalUsers])

    useEffect(() => {
        if (postSearchParams === '') {
            setMatchingPosts(totalPosts);
        } else {
            setMatchingPosts(
                totalPosts.filter(post => {
                    const matchByContent = post.text
                        .toLowerCase()
                        .includes(postSearchParams.toLocaleLowerCase());

                    if (matchByContent) {
                        return true;
                    }
                })
            )
        }
    }, [postSearchParams, totalPosts])

    return (
        <div className="dashboard-container">

            <TotalPostsContext.Provider value={{ matchingPosts, setMatchingPosts }}>
                <PostsCatalog
                    setPostSearchParams={setPostSearchParams}
                />
            </TotalPostsContext.Provider>

            <UsersCatalog
                matchingUsers={matchingUsers}
                setUserSearchParams={setUserSearchParams}
            />
        </div>
    )
}