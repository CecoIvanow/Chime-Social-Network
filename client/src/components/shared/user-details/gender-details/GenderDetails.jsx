import GenderHeaderTitle from "../gender-header-title/GenderHeaderTitle";
import GenderLabelsList from "./gender-labels-list/GenderLabelsList";
import GenderInputsLabel from "./gender-inputs-label/GenderInputsLabel";

export default function GenderDetails({
    userGender,
}) {

    return <>
        <div className="gender-details">
            <GenderInputsLabel
                userGender={userGender}
            />

            <GenderHeaderTitle />

            <GenderLabelsList />
        </div>
    </>
}