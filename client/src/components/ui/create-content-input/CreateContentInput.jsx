export default function CreateContentInput({
    onTextChangeHandler,
    placeholderText,
    text,
}) {
    const placeholderLabel = placeholderText ?? "Share your thoughts...";
    
    return (
        <div className="entry-header">
            <label htmlFor="entry" data-testid="entry-label"></label>
            <input
                type="text"
                name="text"
                id="entry"
                defaultValue={text}
                onChange={onTextChangeHandler}
                placeholder={placeholderLabel}
            />
        </div>
    );
};