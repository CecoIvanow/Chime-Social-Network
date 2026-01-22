import { Link } from "react-router";
import { UserContext } from "../../../../contexts/user-context";
import { useContext } from "react";
import UserAuthMenu from "./user-auth-menu/UserAuthMenu";

export default function AuthMenu() {
    const { isUser } = useContext(UserContext);

    return (
        <ul className='auth-menu'>
            {isUser && (
                <UserAuthMenu />
            )}

            {!isUser && (
                <div className="guest-auth-menu">
                    <li><Link to="/login" title="Login">Login</Link></li>
                    <li><Link to="/register" title="Register">Register</Link></li>
                </div>
            )}
        </ul>
    );
};