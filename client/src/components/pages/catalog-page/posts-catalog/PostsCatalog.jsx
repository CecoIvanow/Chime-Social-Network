import { useContext, useEffect, useState } from "react"

import SectionHeading from "../../../ui/headings/SectionHeading"
import SearchField from "../../../ui/search-field/SearchField"

import { AlertContext } from "../../../../contexts/alert-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";

import usePostServices from "../../../../hooks/usePostServices";
import PostsList from "../../../shared/post/posts-list/PostsList";
import LoadingSpinner from "../../../ui/loading-spinner/LoadingSpinner";

export default function PostsCatalog() {
    const [postSearchParams, setPostSearchParams] = useState('');
    const [totalPosts, setTotalPosts] = useState([]);
    const [matchingPosts, setMatchingPosts] = useState([]);

    const { setAlert } = useContext(AlertContext);
    const { getAllPosts, isLoading } = usePostServices();

    useEffect(() => {
        getAllPosts()
            .then(data => setTotalPosts(data))
            .catch(error => {
                console.error(error);
                setAlert(error.message);
            })

    }, [setAlert, getAllPosts]);

    useEffect(() => {
        if (postSearchParams === '') {
            setMatchingPosts(totalPosts);
        } else {
            setMatchingPosts(
                totalPosts.filter(post => {
                    const matchByContent = post.text
                        .toLowerCase()
                        .includes(postSearchParams.toLowerCase());

                    if (matchByContent) {
                        return true;
                    }
                })
            )
        }
    }, [postSearchParams, totalPosts]);

    return <>
        <div className="posts-catalog">

            <SectionHeading
                sectionName='All Posts:'
            />

            <SearchField
                setSearchParams={setPostSearchParams}
                searchBy={'content'}
            />

            <TotalPostsContext.Provider value={{ totalPosts: matchingPosts, setTotalPosts }}>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <PostsList />
                )}
            </TotalPostsContext.Provider>
        </div>
    </>
}