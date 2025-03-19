export default function Button({
    onClickHandler,
    btnStyle = '',
    buttonName = '',
}) {
    return <>
        <button
            onClick={onClickHandler}
            className={btnStyle}
        >
            {buttonName}
        </button>
    </>
}