import { Link } from "react-router";

export default function GuestAuthMenu() {
    
    return (
        <div className="guest-auth-menu">
            <li><Link to="/login" title="Login">Login</Link></li>
            <li><Link to="/register" title="Register">Register</Link></li>
        </div>
    );
}