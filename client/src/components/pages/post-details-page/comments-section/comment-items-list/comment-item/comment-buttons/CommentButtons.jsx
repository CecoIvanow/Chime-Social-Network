import { useContext } from "react";

import { UserContext } from "../../../../../../../contexts/user-context";

import OwnerButtons from "../../../../../../shared/controls/owner-buttons/OwnerButtons";

export default function CommentButtons({
    comment
}) {
    const { loggedInUserId } = useContext(UserContext);

    return <div className='button-div'>
        <div></div>

        {(loggedInUserId && loggedInUserId === comment.owner._id) && (
            <OwnerButtons
                itemId={comment._id}
            />
        )}
    </div>
}