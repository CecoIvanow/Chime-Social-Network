import { useContext, useEffect, useState } from "react"

import PostItem from "../../../shared/post/post-item/PostItem"
import SectionHeading from "../../../ui/headings/SectionHeading"
import SearchField from "../../../ui/search-field/SearchField"
import postServices from "../../../../services/post-services";
import { AlertContext } from "../../../../contexts/alert-context";

export default function PostsCatalog() {
    const [postSearchParams, setPostSearchParams] = useState('');
    const [totalPosts, setTotalPosts] = useState([]);
    const [matchingPosts, setMatchingPosts] = useState([]);

    const { setAlert } = useContext(AlertContext)

    useEffect(() => {
        const abortController = new AbortController();

        const abortSignal = abortController.signal;

        postServices.handleGetAll({ abortSignal })
            .then(data => setTotalPosts(data))
            .catch(error => {
                console.error(error);
                setAlert(error.message);
            })

        return () => {
            abortController.abort();
        }
    }, [setAlert]);

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
    }, [postSearchParams, totalPosts])

    return <>
        <div className="posts-catalog">

            <SectionHeading
                sectionName='All Posts:'
            />

            <SearchField
                setSearchParams={setPostSearchParams}
                searchBy={'content'}
            />

            {matchingPosts?.map(post =>
                <PostItem
                    key={post._id}
                    post={post}
                    totalPosts={totalPosts}
                    setTotalPosts={setTotalPosts}
                />
            )}
        </div>
    </>
}