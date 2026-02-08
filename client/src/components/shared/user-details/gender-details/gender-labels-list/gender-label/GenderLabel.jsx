export default function GenderLabel({
    label
}) {
    return <>
        <label htmlFor={label.id} data-testid="gender-label">
            <span className={"dot " + label.genderClassName}></span>
            <span className="gender">{label.value}</span>
        </label>
    </>
}