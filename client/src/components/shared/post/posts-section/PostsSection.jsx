import { useContext } from "react";

import PostCreateForm from "../post-create-form/PostCreateForm";
import PostItem from "../post-item/PostItem";
import SectionHeading from '../../../ui/headings/SectionHeading'

import { UserContext } from "../../../../contexts/user-context";
import { TotalPostsContext } from "../../../../contexts/total-posts-context";

export default function PostsSection({
    userData,
    sectionHeadingName,
}) {
    const { isUser } = useContext(UserContext)
    const { totalPosts } = useContext(TotalPostsContext);
    
    return (

        <div className="posts-section">
            <SectionHeading
                sectionName={sectionHeadingName}
            />

            {(isUser && isUser === userData._id) && (
                <PostCreateForm
                    userData={userData}
                />
            )}

            {totalPosts.map(post =>
                <PostItem
                    key={post._id}
                    post={post}
                />
            )}

        </div>
    )
}