import { useContext } from "react"

import LinkButton from "../../../../../../ui/buttons/link-button/LinkButton";
import { UserContext } from "../../../../../../../contexts/user-context";


export default function EditProfileButton() {
    const { loggedInUserId } = useContext(UserContext)

    return <>
        <LinkButton
            urlLink={`/profile/${loggedInUserId}/edit`}
            btnStyle="edit-profile-btn"
            buttonName="Edit Profile"
        />
    </>
}