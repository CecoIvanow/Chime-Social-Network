import { useEffect, useState } from "react"
import GenderInputs from "./gender-inputs/GenderInputs"

export default function GenderDetails({
    userGender,
}) {
    
    const [chosenGender, setChosenGender] = useState('');

    const genderInputsData = [
        { value: "Male", id: "dot-1" },
        { value: "Female", id: "dot-2" },
    ]

    useEffect(() => {
        setChosenGender(userGender);
    }, [userGender])

    const onGenderChangeHandler = (e) => {
        console.log(e.currentTarget.value);
        setChosenGender(e.currentTarget.value);
    }

    return <>
        <div className="gender-details">
            {genderInputsData.map(input =>
                <GenderInputs
                    key={input.id}
                    inputData={input}
                    chosenGender={chosenGender}
                    onChangeHandler={onGenderChangeHandler}
                />
            )}
            <span className="gender-title">Gender</span>
            <div className="category">
                <label htmlFor="dot-1">
                    <span className="dot one"></span>
                    <span className="gender">Male</span>
                </label>
                <label htmlFor="dot-2">
                    <span className="dot two"></span>
                    <span className="gender">Female</span>
                </label>
            </div>
        </div>
    </>
}