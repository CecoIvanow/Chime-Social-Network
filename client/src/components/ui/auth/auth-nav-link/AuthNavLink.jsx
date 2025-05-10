import { Link } from "react-router";

export default function AuthNavLink({
    path,
    buttonText,
}) {
    return <>
        <div className='to-auth'>
            <Link to={path}>{buttonText}</Link>
        </div>
    </>
}