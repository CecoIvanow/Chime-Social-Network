export default function Button({
    btnStyle = '',
    buttonName = '',
    onClickHandler,
}) {
    return <>
        <button
            type="button"
            onClick={onClickHandler}
            className={`button ${btnStyle}`}
        >
            {buttonName}
        </button>
    </>
}