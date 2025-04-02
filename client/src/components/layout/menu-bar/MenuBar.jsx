import { useContext } from "react";
import { Link } from "react-router";

import { UserContext } from "../../../contexts/user-context";

export default function MenuBar() {
    const { isUser } = useContext(UserContext);

    return <>
        <nav>
            <div className="navbar">
                <div className="logo"><Link to="/">Chime</Link></div>
                <ul className="menu">
                    <li><Link to="/" title='Home'><img src="\images\home-icon.png" alt="Home" /></Link></li>
                    {isUser && (
                        <li><Link to={`/profile/${isUser}`} title='Profile'><img src="\images\profile-icon.png" alt="Profile" /></Link></li>
                    )}
                    <li><Link to="/catalog" title='Catalog'><img src="\images\catalog-icon.png" alt="Catalog" /></Link></li>
                    {/* {isUser && (
                        <>
                            <li><Link to="/notifications" title='Notifications'><img src="\images\notifications-icon.png" alt="Notifications" /></Link></li>
                            <li><Link to="/messages" title='Messages'><img src="\images\messages-icon.png" alt="Messages" /></Link></li>
                        </>
                    )} */}
                </ul>
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
            </div>
        </nav>
    </>
}