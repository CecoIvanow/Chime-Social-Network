import PostLikesAmount from "./post-likes-amount/PostLikesAmount";
import PostCommentsAmount from "./post-comments-amount/PostCommentsAmount";

export default function PostInteractionsAmount(){
    return <>
        <div className="post-interactions">
            <PostLikesAmount />
            <PostCommentsAmount />
        </div>
    </>
}