import ProfileFullname from "./profile-fullname/ProfileFullname";

import EditProfileButton from "./edit-profile-button/EditProfileButton";
import ProfileInfoLabelsList from "./profile-info-labels-list/ProfileInfoLabelsList";
import { useContext } from "react";
import { UserContext } from "../../../../../../contexts/user-context";
import { useParams } from "react-router";

export default function ProfileInfo({
    userData
}) {
    const { isUser } = useContext(UserContext);

    const { userId } = useParams();

    return <>
        <div className="profile-info">
            <ProfileFullname
                userData={userData}
            />

            <ProfileInfoLabelsList
                userData={userData}
            />

            {((isUser && (isUser === userId)) || !userId) && (
                <EditProfileButton />
            )}
        </div>
    </>
}