import { useContext } from "react";

import EditControls from "../../../../controls/edit-controls/EditControls";
import OwnerControls from "../../../../controls/owner-controls/OwnerControls";

import { PostContext } from "../../../../../../contexts/post-context";
import { ActionsContext } from "../../../../../../contexts/actions-context";

export default function OwnerButtons() {
    const { post } = useContext(PostContext);
    const { isEditClicked } = useContext(ActionsContext);

    return <div className='owner-buttons'>
        {isEditClicked ? (
            <EditControls />
        ) : (
            <OwnerControls
                urlLink={`/post/${post._id}/edit`}
                itemId={post._id}
            />
        )}
    </div>
}