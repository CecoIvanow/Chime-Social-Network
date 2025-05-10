import Button from "../../../ui/buttons/button/Button";
import SectionHeading from "../../../ui/headings/SectionHeading";
import InputFieldsList from "../../../shared/input-fields/input-fields-list/InputFieldsList";

export default function EmailChangeForm({
    userEmail,
    onSubmitHandler
}) {
    const emailChangeSettingsFields = [
        { fieldName: `Account Email`, inputType: 'text', inputName: 'curEmail' },
        { fieldName: 'New Email', inputType: 'text', inputName: 'newEmail' },
        { fieldName: 'Current Password', inputType: 'password', inputName: 'curPass' },
        { fieldName: 'Repeat Password', inputType: 'password', inputName: 'rePass' },
    ]

    return <>
        <form action={onSubmitHandler}>
            <div className="settings-card password-section">

                <SectionHeading
                    sectionName={`Account Email - ${userEmail}`}
                />

                <InputFieldsList
                    inputFields={emailChangeSettingsFields}
                />

                <Button
                    btnStyle="save-button"
                    buttonName="Change Email"
                />
            </div>
        </form>
    </>
}