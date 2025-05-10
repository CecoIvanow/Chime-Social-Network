import { useContext } from "react"
import { useParams } from "react-router";

import { UserContext } from "../../../../../../contexts/user-context"
import LinkButton from "../../../../../ui/buttons/link-button/LinkButton";
import ProfileInfoLabels from "../../../profile-info-labels/ProfileInfoLabels";

export default function ProfileInfo({
    userData
}) {
    const { isUser } = useContext(UserContext);

    const { userId } = useParams();

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
        <div className="profile-info">
            <h2>{(userData?.firstName)} {(userData?.lastName)}</h2>

            {profileLabels?.map(label =>
                <ProfileInfoLabels
                    key={label.labelText}
                    label={label}
                    userData={userData}
                />
            )}

            {((isUser && (isUser === userId)) || !userId) && (
                <LinkButton
                    urlLink={`/profile/${isUser}/edit`}
                    btnStyle="edit-profile-btn"
                    buttonName="Edit Profile"
                />
            )}
        </div>
    </>
}