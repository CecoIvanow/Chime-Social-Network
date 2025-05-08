import { useContext } from 'react'

import EditControls from '../../../../../controls/edit-controls/EditControls'
import OwnerControls from '../../../../../controls/owner-controls/OwnerControls'
import PostCommentButton from '../post-comment-button/PostCommentButton'
import PostLikeButtons from '../post-like-buttons/PostLikeButtons'

import { UserContext } from '../../../../../../../contexts/user-context'
import { PostContext } from '../../../../../../../contexts/post-context'
import { LikesContext } from '../../../../../../../contexts/likes-context';

export default function PostButtons({
    isEditClicked,
    onDeletePostClickHandler,
    onEditPostClickHandler,
    onSaveEditClickHandler,
    onCancelEditClickHandler
}) {
    const { likes, setLikes } = useContext(LikesContext);
    const { isUser } = useContext(UserContext);
    const { post } = useContext(PostContext);

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
            <div className='owner-buttons'>
                {(isUser && isUser === post?.owner._id) && (
                    <>
                        {isEditClicked ? (
                            <EditControls
                                onSaveClickHandler={onSaveEditClickHandler}
                                onCancelClickHandler={onCancelEditClickHandler}
                            />
                        ) : (
                            <OwnerControls
                                urlLink={`/post/${post._id}/edit`}
                                onEditClickHandler={onEditPostClickHandler}
                                onDeleteClickHandler={onDeletePostClickHandler}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    </>
}