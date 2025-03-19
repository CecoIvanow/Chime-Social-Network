import Button from "../../../ui/buttons/button/Button";
import LinkButton from "../../../ui/buttons/link-button/LinkButton";

export default function OwnerControls({
    urlLink,
    onEditClickHandler,
    onDeleteClickHandler
}) {
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
            onClickHandler={onDeleteClickHandler}
        />
    </>
}