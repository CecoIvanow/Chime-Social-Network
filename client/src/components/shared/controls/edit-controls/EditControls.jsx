import { useContext } from "react";

import Button from "../../../ui/buttons/button/Button";
import LinkButton from "../../../ui/buttons/link-button/LinkButton";

import { ActionsContext } from "../../../../contexts/actions-context";

export default function EditControls({
    urlLink,
    itemId,
}) {
    const { onCancelEditClickHandler, onSaveEditClickHandler } = useContext(ActionsContext);

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
                    onClickHandler={() => onSaveEditClickHandler(itemId)}
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