import { useContext } from "react";
import { useParams } from "react-router";

import PostCreateForm from "../post-create-form/PostCreateForm";
import SectionHeading from "../../../ui/headings/SectionHeading"
import PostsList from "../posts-list/PostsList";
import LoadingSpinner from "../../../ui/loading-spinner/LoadingSpinner";

import { UserContext } from "../../../../contexts/user-context";

export default function PostsSection({
    isLoading,
    userName,
}) {
    const { isUser } = useContext(UserContext);

    const { userId } = useParams();

    const sectionName = userId ?
        isUser === userId ?
            'My Posts:' :
            `${userName}'s Posts:` :
        'Friends Posts:';

    return (
        <div className="posts-section">
            <SectionHeading
                sectionName={sectionName}
            />

            {(isUser && isUser === userId) && (
                <PostCreateForm />
            )}

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <PostsList />
            )}

        </div>

    )
}