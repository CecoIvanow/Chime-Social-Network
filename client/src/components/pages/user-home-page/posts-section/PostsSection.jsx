import CreatePostField from "../../../shared/create-post-field/CreatePostField";
import PostItem from "../../../shared/post-item/PostItem";


export default function PostsSection({
    userId
}) {
    return <>
        <div className="posts-section">
            <CreatePostField
                userId={userId}
            />
            <div className='posts-list'>
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
            </div>
        </div>
    </>
}