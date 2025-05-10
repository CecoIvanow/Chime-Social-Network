import AuthForm from "../../../ui/auth/auth-form/AuthForm";

export default function AuthFormsList() {
    const loginFields = [
        { fieldName: 'Email', inputType: 'email', placeholderText: 'email', inputName: 'email' },
        { fieldName: 'Password', inputType: 'password', placeholderText: 'password', inputName: 'password' }
    ]

    return (
        <div className="user-details">
            {loginFields.map(field =>
                <AuthForm
                    key={field.fieldName}
                    fieldName={field.fieldName}
                    inputName={field.inputName}
                    inputType={field.inputType}
                    placeholderText={field.placeholderText}
                />
            )}
        </div>
    )
}