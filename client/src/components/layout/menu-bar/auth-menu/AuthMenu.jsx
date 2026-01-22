import { Link } from "react-router";
import { UserContext } from "../../../../contexts/user-context";
import { useContext } from "react";

export default function AuthMenu() {
    const { isUser } = useContext(UserContext);

    return (
        <ul className='auth-menu'>
            {isUser && (
                <div className="user-auth-menu">
                    <li><Link to={`/settings`} title='Settings'><img src="\images\settings-icon.png" alt="Catalog" /></Link></li>
                    <li><Link to="/logout" title='Logout'><img src="\images\logout-icon.png" alt="Notifications" /></Link></li>
                </div>
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