import Button from "../../../ui/buttons/button/Button";
import LinkButton from "../../../ui/buttons/link-button/LinkButton";

export default function EditControls({
    urlLink,
    onSaveClickHandler,
    onCancelClickHandler,
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
                    onClickHandler={onSaveClickHandler}
                />
            </>
        )}

        <Button
            buttonName='Close'
            btnStyle='button delete-btn'
            onClickHandler={onCancelClickHandler}
        />
    </>
}