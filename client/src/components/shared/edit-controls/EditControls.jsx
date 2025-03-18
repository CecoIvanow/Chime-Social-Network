export default function EditControls({
    onSaveClickHandler,
    onCancelClickHandler
}) {
    return <>
        <button className='button' type="button" onClick={onSaveClickHandler}>Save</button>
        <button className='button delete-btn' type="button" onClick={onCancelClickHandler}>Cancel</button>
    </>
}