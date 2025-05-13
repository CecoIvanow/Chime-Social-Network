import { useState } from "react"

export default function AuthForm({
    fieldName,
    inputName,
    inputType,
    placeholderText,
}) {
    const [value, setValue] = useState('');

    const onValueChangeHandler = (e) => {
        setValue(e.currentTarget.value);
    }

    return <>
        <div className="input-box" data-testid="auth-input-box">
            <span className="details">{fieldName}</span>
            <label htmlFor={inputName} data-testid="auth-input-label"></label>
            <input
                id={inputName}
                type={inputType}
                placeholder={`Enter your ${placeholderText}`}
                name={inputName}
                defaultValue={value}
                onChange={onValueChangeHandler}
                required
            />
        </div>
    </>
}