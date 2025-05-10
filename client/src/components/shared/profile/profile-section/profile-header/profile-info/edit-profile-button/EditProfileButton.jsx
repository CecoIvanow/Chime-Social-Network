import { useContext } from "react"
import { useParams } from "react-router";

import LinkButton from "../../../../../../ui/buttons/link-button/LinkButton";

import { UserContext } from "../../../../../../../contexts/user-context"

export default function EditProfileButton() {
    const { isUser } = useContext(UserContext);

    const { userId } = useParams();

    return <>
        {((isUser && (isUser === userId)) || !userId) && (
            <LinkButton
                urlLink={`/profile/${isUser}/edit`}
                btnStyle="edit-profile-btn"
                buttonName="Edit Profile"
            />
        )}
    </>
}