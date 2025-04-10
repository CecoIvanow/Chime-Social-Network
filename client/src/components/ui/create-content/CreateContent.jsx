import Button from "../buttons/button/Button";

export default function CreateContent({
    onTextChangeHandler,
    onSubmitHandler,
    placeholderText,
    buttonText,
    text,
}) {
    return <>
        <div className='entry-create'>
            <form action={onSubmitHandler}>
                <div className='entry-header'>
                    <label htmlFor="entry"></label>
                    <input
                        type="text"
                        name="text"
                        id="entry"
                        defaultValue={text}
                        onChange={onTextChangeHandler}
                        placeholder={placeholderText || "Share your thoughts..."}
                    />
                </div>
                <Button
                    btnStyle="button"
                    buttonName={buttonText}
                />
            </form>
        </div>
    </>
}