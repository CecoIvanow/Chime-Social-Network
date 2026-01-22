import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../../../contexts/user-context";

export default function MainMenu() {
    const { isUser } = useContext(UserContext);

    return (
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
    );
};