import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GenderInputsLabel from "./GenderInputsLabel.jsx";

vi.mock("./gender-input/GenderInput", () => ({
    default: ({ inputData, chosenGender, onChangeHandler }) => (
        <label>
            <input
                type="radio"
                value={inputData.value}
                onChange={onChangeHandler}
                checked={chosenGender === inputData.value}
            />
        </label>
    )
}));

function setup(userGender=null) {
    render(
        <GenderInputsLabel userGender={userGender} />
    );
};

describe("GenderInputsLabel", () => {
    it("renders the radio button with Female and Male options", () => {
        setup();

        expect(screen.getByDisplayValue("Male")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Female")).toBeInTheDocument();
    });

    it("default gender option is checked on render", () => {
        setup("Female");

        expect(screen.getByDisplayValue("Female")).toBeChecked();
        expect(screen.getByDisplayValue("Male")).not.toBeChecked();
    });

    it("radio button changes the checked option when clicked on the other option", async () => {
        const user = userEvent.setup(); 
        setup("Male");

        const femaleOption = screen.getByDisplayValue("Female");

        await user.click(femaleOption);

        expect(femaleOption).toBeChecked();
        expect(screen.getByDisplayValue("Male")).not.toBeChecked();
    });
});