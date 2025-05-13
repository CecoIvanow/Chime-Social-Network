import { Link } from "react-router";

export default function AuthNavLink({
    path,
    buttonText,
}) {
    return <>
        <div className='to-auth' data-testid='to-auth-container'>
            <Link to={path}>{buttonText}</Link>
        </div>
    </>
}