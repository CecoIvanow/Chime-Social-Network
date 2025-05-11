export default function CreateContentInput({
    onTextChangeHandler,
    placeholderText,
    text,
}) {
    return (
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
    )
}