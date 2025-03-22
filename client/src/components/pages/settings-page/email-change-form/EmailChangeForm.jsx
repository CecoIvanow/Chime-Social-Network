import Button from "../../../ui/buttons/button/Button";
import SettingsInputFormGroup from "../../../shared/settings/SettingsInputFormGroup";

export default function EmailChangeForm({
    userEmail,
    onSubmitHandler
}) {

    const emailChabgeSettingsFields = [
        { fieldName: `Account Email - ${userEmail}`, inputType: 'text', inputName: 'curEmail' },
        { fieldName: 'New Email', inputType: 'text', inputName: 'newEmail' },
        { fieldName: 'Current Password', inputType: 'password', inputName: 'curPass' },
        { fieldName: 'Repeat Password', inputType: 'password', inputName: 'rePass' },
    ]

    return <>
        <form action={onSubmitHandler}>
            <div className="settings-card password-section">
                <h2 className="settings-heading">Account Email - {userEmail}</h2>

                {emailChabgeSettingsFields.map(field =>
                    <SettingsInputFormGroup
                        key={field.fieldName}   
                        fieldName={field.fieldName}
                        inputType={field.inputType}
                        inputName={field.inputName}
                    />
                )}

                <Button
                    btnStyle="save-button"
                    buttonName="Change Email"
                />
            </div>
        </form>
    </>
}