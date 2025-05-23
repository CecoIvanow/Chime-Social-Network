import PostInteractionButtons from './post-interaction-buttons/PostInteractionButtons'

import OwnerButtons from '../../../controls/owner-buttons/OwnerButtons'
import { useContext } from 'react'
import { UserContext } from '../../../../../contexts/user-context'
import { PostContext } from '../../../../../contexts/post-context';

export default function PostButtons() {
    const { post } = useContext(PostContext);
    const { isUser } = useContext(UserContext);

    return <div className='button-div'>
        <PostInteractionButtons />

        {(isUser && isUser === post?.owner._id) &&
            <OwnerButtons
                urlLink={`/post/${post._id}/edit`}
                itemId={post._id}
            />
        }
    </div>
}