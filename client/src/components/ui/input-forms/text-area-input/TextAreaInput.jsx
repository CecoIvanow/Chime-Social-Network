export default function TextAreaInput({
    value,
    fieldName,
    inputName
}) {
    return <>
        <div className="form-group">
            <label className="form-label">{fieldName}</label>
            <textarea className="edit-textarea" name={inputName}>{value}</textarea>
        </div>
    </>
}