import SettingsInputFormGroup from "../../../shared/settings/SettingsInputFormGroup";
import Button from "../../../ui/buttons/button/Button";


export default function PasswordChangeForm({
    onSubmitHandler
}) {

    const passwordChangeSettingsFields = [
        { fieldName: `Current Email`, inputType: 'text', inputName: 'curEmail' },
        { fieldName: 'Current Password', inputType: 'password', inputName: 'curPass' },
        { fieldName: 'New Password', inputType: 'password', inputName: 'newPass' },
        { fieldName: 'Repeat New Password', inputType: 'password', inputName: 'rePass' },
    ]

    return <>
        <form action={onSubmitHandler}>
            <div className="settings-card password-section">
                <h2 className="settings-heading">Account Password - ******</h2>

                {passwordChangeSettingsFields.map(field =>
                    <SettingsInputFormGroup
                        key={field.fieldName}
                        fieldName={field.fieldName}
                        inputName={field.inputName}
                        inputType={field.inputType}
                    />
                )}

                <Button
                    btnStyle="save-button"
                    buttonName="Change Password"
                />
            </div>
        </form>
    </>
}