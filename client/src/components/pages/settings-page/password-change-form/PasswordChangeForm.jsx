import Button from "../../../ui/buttons/button/Button";
import SectionHeading from "../../../ui/headings/SectionHeading";
import InputFieldsList from "../../../shared/input-fields/input-fields-list/InputFieldsList";

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

                <SectionHeading
                    sectionName='Account Password - ******'
                />

                <InputFieldsList
                    inputFields={passwordChangeSettingsFields}
                />

                <Button
                    btnStyle="save-button"
                    buttonName="Change Password"
                />
            </div>
        </form>
    </>
}