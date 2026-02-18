import { Link } from "react-router";

export default function MenuLink({
    linkUrl,
    linkTitle,
    linkImageUri = "",
    linkImageAlt = "",
    linkText = "",
}) {

    return (
        <li>
            <Link to={linkUrl} title={linkTitle}>
                {linkImageUri ? (
                    <img src={linkImageUri} alt={linkImageAlt} />
                ) : (
                    linkText
                )}
            </Link>
        </li>
    );
}