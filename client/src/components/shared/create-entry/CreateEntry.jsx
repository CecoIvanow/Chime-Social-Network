import Button from "../../ui/button/Button";

export default function CreateEntry({
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
                        value={text}
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