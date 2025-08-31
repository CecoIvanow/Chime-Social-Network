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

describe("GenderInputsLabel", () => {
    it("renders both gender options", () => {
        render(<GenderInputsLabel userGender="Male" />);

        expect(screen.getAllByTestId("gender-input")).toHaveLength(2);

        expect(screen.getByDisplayValue("Male")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Female")).toBeInTheDocument();
    });

    it("sets correct Gender based on userGender prop", () => {
        render(<GenderInputsLabel userGender="Female" />);

        expect(screen.getByDisplayValue("Female")).toBeChecked();
        expect(screen.getByDisplayValue("Male")).not.toBeChecked();
    });

    it("updates chosenGender when a different option is clicked", () => {
        render(<GenderInputsLabel userGender="Male" />);

        const femaleOption = screen.getByDisplayValue("Female");

        fireEvent.click(femaleOption);

        expect(femaleOption).toBeChecked();
        expect(screen.getByDisplayValue("Male")).not.toBeChecked();
    });
})