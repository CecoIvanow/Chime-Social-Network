import { useEffect, useState } from "react";

import GenderInput from "./gender-input/GenderInput";

export default function GenderInputsLabel({
    userGender
}) {
    const [chosenGender, setChosenGender] = useState('');

    const genderInputs = [
        { value: "Male", id: "dot-1" },
        { value: "Female", id: "dot-2" },
    ]

    useEffect(() => {
        setChosenGender(userGender);
    }, [userGender])

    const onGenderChangeHandler = (e) => {
        setChosenGender(e.currentTarget.value);
    }

    return <>
        {genderInputs.map(input =>
            <GenderInput
                key={input.id}
                inputData={input}
                chosenGender={chosenGender}
                onChangeHandler={onGenderChangeHandler}
            />
        )}
    </>
}