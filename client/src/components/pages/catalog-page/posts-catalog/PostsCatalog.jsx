import { useContext } from "react"

import { TotalPostsContext } from "../../../../contexts/total-posts-context";

import PostItem from "../../../shared/post/post-item/PostItem"
import SectionHeading from "../../../ui/headings/SectionHeading"
import SearchField from "../../../ui/search-field/SearchField"

export default function PostsCatalog({
    setPostSearchParams,
}) {
    const { totalPosts } = useContext(TotalPostsContext);

    return <>
        <div className="posts-catalog">

            <SectionHeading
                sectionName='All Posts:'
            />

            <SearchField
                setSearchParams={setPostSearchParams}
                searchBy={'text'}
            />

            {totalPosts?.map(post =>
                <PostItem
                    key={post._id}
                    post={post}
                />
            )}
        </div>
    </>
}