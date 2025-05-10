import AuthForm from "../../../ui/auth/auth-form/AuthForm";

export default function AuthFormsList({
    authFieldsList
}) {


    return (
        <div className="user-details">
            {authFieldsList.map(field =>
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