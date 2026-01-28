import { Link } from "react-router";

export default function LinkButton({
    urlLink,
    btnStyle,
    buttonName,
}) {
    const label = buttonName ?? "";
    const style = btnStyle ?? "";

    return (
        <Link
            to={urlLink}
        >
            <button
                className={style}
            >
                {label}
            </button>
        </Link >
    )
}