export default function CreateContentInput({
    onTextChangeHandler,
    placeholderText,
    text,
}) {
    return (
        <div className="entry-header" data-testid="entry-header">
            <label htmlFor="entry" data-testid="entry-label"></label>
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