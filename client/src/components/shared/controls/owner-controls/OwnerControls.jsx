import { useContext } from "react";

import Button from "../../../ui/buttons/button/Button";
import LinkButton from "../../../ui/buttons/link-button/LinkButton";

import { PostActionsContext } from "../../../../contexts/post-actions-context";
import { PostContext } from "../../../../contexts/post-context";

export default function OwnerControls({
    urlLink,
}) {
    const { post } = useContext(PostContext);
    const { onDeletePostClickHandler, onEditPostClickHandler } = useContext(PostActionsContext);

    return <>
        {urlLink ? (
            <>
                <LinkButton
                    buttonName="Edit"
                    btnStyle="button"
                    urlLink={urlLink}
                />
            </>
        ) : (
            <>
                <Button
                    buttonName="Edit"
                    btnStyle="button"
                        onClickHandler={onEditPostClickHandler}
                />
            </>
        )}

        <Button
            buttonName="Delete"
            btnStyle="button delete-btn"
            onClickHandler={() => onDeletePostClickHandler(post._id)}
        />
    </>
}