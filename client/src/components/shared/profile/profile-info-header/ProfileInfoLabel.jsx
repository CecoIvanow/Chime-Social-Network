export default function ProfileInfoLabel({
    label = {},
    userData = {},
}) {
    return <>
        <p><span
            className="info-label">
            {label.labelText}
        </span>
            {userData[label.labelKey] ? userData[label.labelKey] : 'N\\A'}</p>
    </>
}