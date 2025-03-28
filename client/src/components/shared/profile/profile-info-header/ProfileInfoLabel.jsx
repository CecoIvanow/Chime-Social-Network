export default function ProfileInfoLabel({
    labelText,
    userData,
    labelKey,
}) {
    return <>
        <p><span className="info-label">{labelText}</span> {userData[labelKey] ? userData[labelKey] : 'N\\A'}</p>
    </>
}