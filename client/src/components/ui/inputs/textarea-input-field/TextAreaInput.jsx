export default function TextAreaInput({
    initialValue,
    fieldName,
    inputName
}) {
    return <>
        <div className="form-group">
            <label className="form-label">{fieldName}</label>
            <textarea className="edit-textarea" name={inputName} defaultValue={initialValue}></textarea>
        </div>
    </>
}