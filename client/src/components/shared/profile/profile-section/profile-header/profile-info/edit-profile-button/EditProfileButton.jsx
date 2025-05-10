import { useContext } from "react"

import LinkButton from "../../../../../../ui/buttons/link-button/LinkButton";
import { UserContext } from "../../../../../../../contexts/user-context";


export default function EditProfileButton() {
    const { isUser } = useContext(UserContext)

    return <>
            <LinkButton
                urlLink={`/profile/${isUser}/edit`}
                btnStyle="edit-profile-btn"
                buttonName="Edit Profile"
            />
    </>
}