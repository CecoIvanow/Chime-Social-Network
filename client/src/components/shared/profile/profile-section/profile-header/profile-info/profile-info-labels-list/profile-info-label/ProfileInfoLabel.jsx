export default function ProfileInfoLabel({
    label,
    userData = {},
}) {
    const paragraphText = userData[label.labelKey] ?? 'N\\A';

    return <>
        <p>
            <span
                className="info-label"
            >
                {label.labelText}
            </span>
            {paragraphText}
        </p>
    </>
}