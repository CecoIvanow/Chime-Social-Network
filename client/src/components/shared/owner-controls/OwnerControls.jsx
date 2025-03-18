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
                    urlLink={urlLink}
                />
            </>
        ) : (
            <>
                <Button
                    buttonName="Edit"
                    onClickHandler={onEditClickHandler}
                />
            </>
        )}

        <Button
            buttonName="Delete"
            btnStyle="delete-btn"
            onClickHandler={onDeleteClickHandler}
        />
    </>
}