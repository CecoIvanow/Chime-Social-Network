import { Link } from "react-router";

export default function LinkButton({
    urlLink,
    btnStyle = '',
    buttonName = '',
}) {
    return <>
        <Link
            to={urlLink}
        >
            <button
                className={btnStyle}
            >
                {buttonName}
            </button>
        </Link >
    </>
}