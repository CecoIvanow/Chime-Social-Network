import { useContext } from 'react'

import OwnerControls from '../../../../../controls/owner-controls/OwnerControls'
import PostCommentButton from '../post-comment-button/PostCommentButton'
import PostLikeButtons from '../post-like-buttons/PostLikeButtons'

import { TotalPostsContext } from '../../../../../../../contexts/total-posts-context';
import { UserContext } from '../../../../../../../contexts/user-context'
import { PostContext } from '../../../../../../../contexts/post-context'
import { AlertContext } from '../../../../../../../contexts/alert-context'

import usePostServices from '../../../../../../../hooks/usePostServices'
import { LikesContext } from '../../../../../../../contexts/likes-context';

export default function PostButtons() {
    const { likes, setLikes } = useContext(LikesContext);
    const { totalPosts, setTotalPosts } = useContext(TotalPostsContext);
    const { isUser } = useContext(UserContext);
    const { setAlert } = useContext(AlertContext);
    const { post } = useContext(PostContext);

    const { deletePost } = usePostServices();

    const onDeletePostClickHandler = async () => {
        const isDeleteConFirmed = confirm('Are you sure you want to delete this post');

        if (!isDeleteConFirmed) {
            return totalPosts; // Returns totalPosts unnecessarily because otherwise eslint marks it as not used!
        }

        try {
            const deletedPostId = await deletePost(post._id);

            setTotalPosts(totalPosts => totalPosts.filter(post => post._id !== deletedPostId))
        } catch (error) {
            console.error(error);
            setAlert(error.message);
        }
    }

    return <>
        <div className='button-div'>
            <div>
                {isUser && (
                    <>
                        {(isUser !== post.owner._id &&
                            <PostLikeButtons
                                likes={likes}
                                setLikes={setLikes}
                            />
                        )}

                        <PostCommentButton />
                    </>
                )}
            </div>
            <div>
                {isUser && isUser === post.owner._id && (
                    <OwnerControls
                        urlLink={`/post/${post._id}/edit`}
                        onDeleteClickHandler={onDeletePostClickHandler}
                    />
                )}
            </div>
        </div>
    </>
}