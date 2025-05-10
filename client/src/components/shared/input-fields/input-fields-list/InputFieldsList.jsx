import InputField from "../../../ui/inputs/input-field/InputField";

export default function InputFieldsList({
    inputFields,
}) {
    return <>
        {inputFields.map(field =>
            <InputField
                key={field.inputName}
                fieldName={field.fieldName}
                inputName={field.inputName}
                inputType={field.inputType}
                initialValue={field.value}
            />
        )}
    </>
}