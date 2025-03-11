import { Link } from "react-router";

export default function MenuBar({
    isUser
}) {
    return <>
        <nav>
            <div className="navbar">
                <div className="logo"><Link to="/">Chime</Link></div>
                <ul className="menu">
                    <li><Link to="/" title='Home'><img src="\src\public\images\home-icon.png" alt="Home" /></Link></li>
                    {isUser && (
                        <li><Link to={`/profile/${isUser}`} title='Profile'><img src="\src\public\images\profile-icon.png" alt="Profile" /></Link></li>
                    )}
                    <li><Link to="/catalog" title='Catalog'><img src="\src\public\images\catalog-icon.png" alt="Catalog" /></Link></li>
                    {isUser && (
                        <>
                            <li><Link to="/notifications" title='Notifications'><img src="\src\public\images\notifications-icon.png" alt="Notifications" /></Link></li>
                            <li><Link to="/messages" title='Messages'><img src="\src\public\images\messages-icon.png" alt="Messages" /></Link></li>
                        </>
                    )}
                </ul>
                <ul className='auth-menu'>
                    {isUser && (
                        <div className="user-auth-menu">
                            <li><Link to={`/settings`} title='Settings'><img src="\src\public\images\settings-icon.png" alt="Catalog" /></Link></li>
                            <li><Link to="/logout" title='Logout'><img src="\src\public\images\logout-icon.png" alt="Notifications" /></Link></li>
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