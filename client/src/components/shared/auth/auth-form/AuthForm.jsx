export default function AuthForm({
    fieldName,
    inputName,
    inputType,
    placeholderText,
}) {
    return <>
        <div className="input-box">
            <span className="details">{fieldName}</span>
            <input type={inputType} placeholder={`Enter your ${placeholderText}`} name={inputName} required />
        </div>
    </>
}