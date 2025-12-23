import TextAreaInput from "../../../ui/inputs/textarea-input-field/TextAreaInput";

export default function ProfileBioTextArea({
    userData
}) {
    return <TextAreaInput
        fieldName='Bio'
        inputName='bio'
        initialValue={userData?.bio}
    />
}