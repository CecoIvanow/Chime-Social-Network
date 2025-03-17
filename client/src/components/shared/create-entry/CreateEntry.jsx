export default function CreateEntry({
    onTextChangeHandler,
    onSubmitHandler,
    buttonText,
    text,
}) {
    return <>
        <div className='entry-create'>
            <form action={onSubmitHandler}>
                <div className='entry-header'>
                    <label htmlFor="entry"></label>
                    <input type="text" name="text" id="entry" value={text} onChange={onTextChangeHandler} placeholder="Share your thoughts..." />
                </div>
                <button className='button'>{buttonText}</button>
            </form>
        </div>
    </>
}