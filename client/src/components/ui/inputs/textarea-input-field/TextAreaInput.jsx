export default function TextAreaInput({
    initialValue,
    fieldName,
    inputName
}) {
    return <>
        <div className="form-group">
            <label className="form-label" htmlFor={inputName}>{fieldName}</label>
            <textarea
                id={inputName}
                className="edit-textarea"
                name={inputName}
                defaultValue={initialValue}
            />
        </div>
    </>
}