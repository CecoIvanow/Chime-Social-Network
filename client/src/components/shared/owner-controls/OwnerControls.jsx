export default function OwnerControls({
    onEditClickHandler,
    onDeleteClickHandler
}) {
    return <>
        <button className='button' type="button" onClick={onEditClickHandler}>Edit</button>
        <button className='button delete-btn' type="button" onClick={onDeleteClickHandler}>Delete</button>
    </>
}