export default function InputField({
    initialValue,
    fieldName,
    inputName,
    inputType,
}) {

    return <>
        <div className="form-group" data-testid="form-group">
            <label className="form-label" htmlFor={inputName}>{fieldName}</label>
            <input
                id={inputName}
                type={inputType}
                className="form-input"
                name={inputName}
                defaultValue={initialValue}
            />
        </div>
    </>
}