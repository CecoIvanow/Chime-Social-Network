export default function SettingsInputFormGroup({
    fieldName,
    inputName,
    inputType,
}) {
    return <>
        <div className="form-group">
            <label className="form-label">{fieldName}</label>
            <input type={inputType} className="form-input" name={inputName} />
        </div>
    </>
}