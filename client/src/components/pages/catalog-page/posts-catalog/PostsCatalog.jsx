import PostItem from "../../../shared/post/post-item/PostItem"
import SearchField from "../../../shared/search-field/SearchField"

export default function PostsCatalog({
    isUser,
    totalPosts,
    setTotalPosts,
    setPostSearchParams,
}) {
    return <>
        <div className="posts-catalog">
            <h2 className="section-heading">All Posts:</h2>

            <SearchField
                setSearchParams={setPostSearchParams}
                searchBy={'text'}
            />

            
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
    </>
}