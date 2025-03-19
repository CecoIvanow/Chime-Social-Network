import PostCreateForm from "../../../shared/post/post-create-form/PostCreateForm";
import PostItem from "../../../shared/post/post-item/PostItem";

export default function PostsSection({
    userId
}) {
    return <>
        <div className="posts-section">
            <PostCreateForm
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