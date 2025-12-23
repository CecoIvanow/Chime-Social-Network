import CommentItemsList from "./comment-items-list/CommentItemsList";
import CommentsSectionHeader from "./comments-section-header/CommentsSectionHeader";

export default function CommentsSection() {


    return <div className="post-comments">
        <CommentsSectionHeader />
        <CommentItemsList />
    </div>
}