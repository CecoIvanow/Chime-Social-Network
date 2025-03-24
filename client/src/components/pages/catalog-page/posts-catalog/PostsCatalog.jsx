import PostItem from "../../../shared/post/post-item/PostItem"
import SectionHeading from "../../../ui/headings/SectionHeading"
import SearchField from "../../../ui/search-field/SearchField"

export default function PostsCatalog({
    totalPosts,
    setTotalPosts,
    setPostSearchParams,
}) {
    return <>
        <div className="posts-catalog">

            <SectionHeading
                sectionName='All Posts:'
            />

            <SearchField
                setSearchParams={setPostSearchParams}
                searchBy={'text'}
            />

            {totalPosts.map(post => 
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