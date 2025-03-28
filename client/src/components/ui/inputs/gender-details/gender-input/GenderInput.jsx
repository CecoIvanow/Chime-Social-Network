export default function GenderInput({
    inputData,
    chosenGender,
    onChangeHandler,
}) {
    return <>
        <input type="radio"
            value={inputData.value}
            name="gender"
            id={inputData.id}
            checked={chosenGender === inputData.value}
            onChange={onChangeHandler}
        />
    </>
}