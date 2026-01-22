import { Link } from "react-router";

export default function UserAuthMenu() {
    
    return (
        <div className="user-auth-menu">
            <li><Link to={`/settings`} title='Settings'><img src="\images\settings-icon.png" alt="Catalog" /></Link></li>
            <li><Link to="/logout" title='Logout'><img src="\images\logout-icon.png" alt="Notifications" /></Link></li>
        </div>
    );
}