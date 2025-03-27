export default function TextAreaInput({
    value,
    fieldName

}) {
    return <>
        <div className="form-group">
            <label className="form-label">{fieldName}</label>
            <textarea className="edit-textarea">{value}</textarea>
        </div>
    </>
}