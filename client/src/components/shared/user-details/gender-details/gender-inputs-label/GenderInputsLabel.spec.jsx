import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GenderInputsLabel from "./GenderInputsLabel.jsx";

vi.mock("./gender-input/GenderInput", () => ({
    default: ({ inputData, chosenGender, onChangeHandler }) => (
        <label>
            <input
                data-testid="gender-input"
                type="radio"
                value={inputData.value}
                onChange={onChangeHandler}
                checked={chosenGender === inputData.value}
            >

            </input>
        </label>
    )
}));

function setup(userGender=null) {
    render(<GenderInputsLabel userGender={userGender} />);
};

describe("GenderInputsLabel", () => {
    it("renders the radio button with Female and Male options", () => {
        setup();

        expect(screen.getByDisplayValue("Male")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Female")).toBeInTheDocument();
    });

    it("sets correct Gender based on userGender prop", () => {
        setup("Female");

        expect(screen.getByDisplayValue("Female")).toBeChecked();
        expect(screen.getByDisplayValue("Male")).not.toBeChecked();
    });

    it("updates chosenGender when a different option is clicked", () => {
        setup("Male");

        const femaleOption = screen.getByDisplayValue("Female");

        fireEvent.click(femaleOption);

        expect(femaleOption).toBeChecked();
        expect(screen.getByDisplayValue("Male")).not.toBeChecked();
    });
})