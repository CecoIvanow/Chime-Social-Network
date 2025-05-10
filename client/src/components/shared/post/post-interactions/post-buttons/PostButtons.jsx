import { useContext } from 'react'

import EditControls from '../../../controls/edit-controls/EditControls'
import OwnerControls from '../../../controls/owner-controls/OwnerControls'
import PostCommentButton from './post-comment-button/PostCommentButton'
import PostLikeButtons from './post-like-buttons/PostLikeButtons'

import { UserContext } from '../../../../../contexts/user-context'
import { PostContext } from '../../../../../contexts/post-context'
import { ActionsContext } from '../../../../../contexts/actions-context'
import { useParams } from 'react-router'

export default function PostButtons() {
    const { post } = useContext(PostContext);
    const { isUser } = useContext(UserContext);
    const { isEditClicked } = useContext(ActionsContext);

    const { postId } = useParams();

    return <>
        <div className='button-div'>
            <div>
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
            <div className='owner-buttons'>
                {(isUser && isUser === post?.owner._id) && (
                    <>
                        {isEditClicked ? (
                            <EditControls />
                        ) : (
                            <OwnerControls
                                urlLink={`/post/${post._id}/edit`}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    </>
}