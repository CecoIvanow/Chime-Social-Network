import Button from "../../ui/button/Button";
import LinkButton from "../../ui/link-button/LinkButton";

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
                    urlLink={urlLink}
                />
            </>
        ) : (
            <>
                <Button
                    buttonName="Edit"
                    onClickHandler={onSaveClickHandler}
                />
            </>
        )}

        <Button
            buttonName='Close'
            btnStyle='delete-btn'
            onClickHandler={onCancelClickHandler}
        />
    </>
}