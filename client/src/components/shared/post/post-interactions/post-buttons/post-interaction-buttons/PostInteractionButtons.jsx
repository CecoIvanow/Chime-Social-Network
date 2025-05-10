import { useContext } from "react"
import { useParams } from "react-router";

import PostLikeButtons from "./post-like-buttons/PostLikeButtons";
import PostCommentButton from "./post-comment-button/PostCommentButton";

import { UserContext } from "../../../../../../contexts/user-context"
import { PostContext } from "../../../../../../contexts/post-context";

export default function PostInteractionButtons() {
    const { post } = useContext(PostContext);
    const { isUser } = useContext(UserContext);

    const { postId } = useParams();

    return <div>
        {isUser && <>
            {(isUser !== post.owner._id) &&
                <PostLikeButtons />
            }

            {!postId &&
                <PostCommentButton />
            }
        </>
        }
    </div>
}