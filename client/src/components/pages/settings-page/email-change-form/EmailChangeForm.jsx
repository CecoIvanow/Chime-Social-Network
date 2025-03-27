import Button from "../../../ui/buttons/button/Button";
import InputField from "../../../ui/inputs/input-field/InputField";
import SectionHeading from "../../../ui/headings/SectionHeading";

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
                
                <SectionHeading
                    sectionName={`Account Email - ${userEmail}`}
                />

                {emailChabgeSettingsFields.map(field =>
                    <InputField
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