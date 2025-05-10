import { useContext } from "react";

import EditControls from "../edit-controls/EditControls";
import OwnerControls from "../owner-controls/OwnerControls";

import { ActionsContext } from "../../../../contexts/actions-context";

export default function OwnerButtons({
    itemId,
    urlLink,
}) {
    const { isEditClicked } = useContext(ActionsContext);

    return <div className='owner-buttons'>
        {isEditClicked ? (
            <EditControls
                itemId={itemId}
            />
        ) : (
            <OwnerControls
                urlLink={urlLink}
                itemId={itemId}
            />
        )}
    </div>
}