import { useContext } from 'react'

import PostInteractionButtons from './post-interaction-buttons/PostInteractionButtons'
import OwnerButtons from '../../../controls/owner-buttons/OwnerButtons'

import { UserContext } from '../../../../../contexts/user-context'
import { PostContext } from '../../../../../contexts/post-context';

export default function PostButtons() {
    const { post } = useContext(PostContext);
    const { loggedInUserId } = useContext(UserContext);

    return <div className='button-div'>
        <PostInteractionButtons />

        {(loggedInUserId && loggedInUserId === post?.owner._id) &&
            <OwnerButtons
                urlLink={`/post/${post._id}/edit`}
                itemId={post._id}
            />
        }
    </div>
}