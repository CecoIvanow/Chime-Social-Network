import Button from "../../ui/button/Button";
import LinkButton from "../../ui/link-button/LinkButton";

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