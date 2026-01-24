import { useContext } from "react";

import { UserContext } from "../../../../contexts/user-context";

import UserAuthMenu from "./user-auth-menu/UserAuthMenu";
import GuestAuthMenu from "./guest-auth-menu/GuestAuthMenu";

export default function AuthMenu() {
    const { isUser } = useContext(UserContext);

    return (
        <ul className='auth-menu'>
            {isUser ? (
                <UserAuthMenu />
            ) : (
                <GuestAuthMenu />
            )}
        </ul>
    );
};