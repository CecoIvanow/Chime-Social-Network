import { useContext } from "react";

import Button from "../../../ui/buttons/button/Button";
import LinkButton from "../../../ui/buttons/link-button/LinkButton";

import { ActionsContext } from "../../../../contexts/actions-context";

export default function OwnerControls({
    itemId,
    urlLink,
}) {
    const { onDeleteClickHandler, onEditClickHandler } = useContext(ActionsContext);

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
                    onClickHandler={onEditClickHandler}
                />
            </>
        )}

        <Button
            buttonName="Delete"
            btnStyle="button delete-btn"
            onClickHandler={() => onDeleteClickHandler(itemId)}
        />
    </>
}