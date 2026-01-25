export default function Button({
    onClickHandler,
    btnStyle,
    buttonName,
}) {
    const label = buttonName ?? "";
    const style = btnStyle ?? "";

    return <>
        <button
            onClick={onClickHandler}
            className={style}
        >
            {label}
        </button>
    </>
}