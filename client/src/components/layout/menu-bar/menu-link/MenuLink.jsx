import { Link } from "react-router";

export default function MenuLink({
    linkUrl = "/",
    linkTitle = "",
    linkImageUri = "",
    linkImageAlt = "",
    linkText = "",
}) {

    return (
        <li>
            <Link to={linkUrl} title={linkTitle}>
                {linkText ? (
                    linkText
                ) : (
                    <img src={linkImageUri} alt={linkImageAlt} />
                )}
            </Link>
        </li>
    );
}