import Button from "../../../ui/buttons/button/Button";
import CreateContentInput from "../../../ui/create-content-input/CreateContentInput";

export default function CreateContentInputField({
    onTextChangeHandler,
    onSubmitHandler,
    placeholderText,
    buttonText,
    text,
}) {
    return <>
        <div className='entry-create'>
            <form action={onSubmitHandler} data-testid="form-action-submit">
                <CreateContentInput
                    onTextChangeHandler={onTextChangeHandler}
                    placeholderText={placeholderText}
                    text={text}
                />

                <Button
                    btnStyle="button"
                    buttonName={buttonText}
                />
            </form>
        </div>
    </>
}