import TextAreaInput from "../../../ui/inputs/textarea-input-field/TextAreaInput";

export default function ProfileBioTextarea({
    userData
}) {
    return <TextAreaInput
        fieldName='Bio'
        inputName='bio'
        initialValue={userData?.bio}
    />
}