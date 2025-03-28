import { useEffect, useState } from "react"
import GenderInput from "./gender-input/GenderInput"
import GenderLabel from "./gender-label/GenderLabel";

export default function GenderDetails({
    userGender,
}) {

    const [chosenGender, setChosenGender] = useState('');

    const genderInputs = [
        { value: "Male", id: "dot-1" },
        { value: "Female", id: "dot-2" },
    ]

    const genderLabels = [
        { id: "dot-1", value: "Male", genderClassName: "one" },
        { id: "dot-2", value: "Female", genderClassName: "two" },
    ]

    useEffect(() => {
        setChosenGender(userGender);
    }, [userGender])

    const onGenderChangeHandler = (e) => {
        setChosenGender(e.currentTarget.value);
    }

    return <>
        <div className="gender-details">
            {genderInputs.map(input =>
                <GenderInput
                    key={input.id}
                    inputData={input}
                    chosenGender={chosenGender}
                    onChangeHandler={onGenderChangeHandler}
                />
            )}
            <span className="gender-title">Gender</span>
            <div className="category">
                {genderLabels.map(label =>
                    <GenderLabel 
                        key={label.id}
                        label={label}                        
                    />
                )}
            </div>
        </div>
    </>
}