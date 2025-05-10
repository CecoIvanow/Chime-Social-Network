import ProfileInfoLabel from "./profile-info-label/ProfileInfoLabel"

export default function ProfileInfoLabelsList({
    userData
}) {
    const profileLabels = [
        { labelText: 'Bio:', labelKey: 'bio' },
        { labelText: 'Age:', labelKey: 'age' },
        { labelText: 'Gender:', labelKey: 'gender' },
        { labelText: 'Location:', labelKey: 'location' },
        { labelText: 'Occupation:', labelKey: 'occupation' },
        { labelText: 'Education:', labelKey: 'education' },
        { labelText: 'Status:', labelKey: 'status' },
        { labelText: 'Member Since:', labelKey: 'memberSince' },
    ]

    return <>
        {profileLabels?.map(label =>
            <ProfileInfoLabel
                key={label.labelText}
                label={label}
                userData={userData}
            />
        )}
    </>
}