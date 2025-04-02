import { useContext, useEffect, useState } from "react"

import PostItem from "../../../shared/post/post-item/PostItem"
import SectionHeading from "../../../ui/headings/SectionHeading"
import SearchField from "../../../ui/search-field/SearchField"

import { AlertContext } from "../../../../contexts/alert-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";

import usePostServices from "../../../../hooks/usePostServices";

export default function PostsCatalog() {
    const [postSearchParams, setPostSearchParams] = useState('');
    const [totalPosts, setTotalPosts] = useState([]);
    const [matchingPosts, setMatchingPosts] = useState([]);

    const { setAlert } = useContext(AlertContext);
    const { getAllPosts } = usePostServices();

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

            <TotalPostsContext.Provider value={{ totalPosts, setTotalPosts }}>
                {matchingPosts?.map(post =>
                    <PostItem
                        key={post._id}
                        post={post}

                    />
                )}
            </TotalPostsContext.Provider>
        </div>
    </>
}