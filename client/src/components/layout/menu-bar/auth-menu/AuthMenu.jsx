import { useContext } from "react";

import { UserContext } from "../../../../contexts/user-context";

import UserAuthMenu from "./user-auth-menu/UserAuthMenu";
import GuestAuthMenu from "./guest-auth-menu/GuestAuthMenu";

export default function AuthMenu() {
    const { loggedInUserId } = useContext(UserContext);

    return (
        <ul className='auth-menu'>
            {loggedInUserId ? (
                <UserAuthMenu />
            ) : (
                <GuestAuthMenu />
            )}
        </ul>
    );
};