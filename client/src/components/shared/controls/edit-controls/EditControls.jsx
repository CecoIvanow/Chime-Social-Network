import { useContext } from "react";

import Button from "../../../ui/buttons/button/Button";
import LinkButton from "../../../ui/buttons/link-button/LinkButton";

import { PostActionsContext } from "../../../../contexts/post-actions-context";

export default function EditControls({
    urlLink,
}) {
    const { onCancelEditClickHandler, onSaveEditClickHandler } = useContext(PostActionsContext);

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
                        onClickHandler={onSaveEditClickHandler}
                />
            </>
        )}

        <Button
            buttonName='Close'
            btnStyle='button delete-btn'
            onClickHandler={onCancelEditClickHandler}
        />
    </>
}