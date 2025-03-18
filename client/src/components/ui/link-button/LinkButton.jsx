import { Link } from "react-router";

export default function LinkButton({
    urlLink,
    btnStyle = '',
    buttonName = '',
}) {
    return <>
        <button
            type="button"
            className={`button ${btnStyle}`}
        >
            <Link
                to={urlLink}
            >
                {buttonName}
            </Link>
        </button>
    </>
}