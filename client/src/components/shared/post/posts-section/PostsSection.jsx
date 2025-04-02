import { useContext } from "react";

import PostCreateForm from "../post-create-form/PostCreateForm";
import SectionHeading from '../../../ui/headings/SectionHeading'

import { UserContext } from "../../../../contexts/user-context";
import PostsList from "../posts-list/PostsList";
import LoadingSpinner from "../../../ui/loading-spinner/LoadingSpinner";

export default function PostsSection({
    userData,
    isLoading,
    sectionHeadingName,
}) {
    const { isUser } = useContext(UserContext)

    return (

        <div className="posts-section">
            <SectionHeading
                sectionName={sectionHeadingName}
            />

            {(isUser && isUser === userData?._id) && (
                <PostCreateForm
                    userData={userData}
                />
            )}

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <PostsList />
            )}

        </div>
    )
}