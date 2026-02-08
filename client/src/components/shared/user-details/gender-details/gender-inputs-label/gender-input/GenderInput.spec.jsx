import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GenderInput from "./GenderInput.jsx";

const mockProps = {
    inputData: {
        value: "Female",
        id: "femaleid",
    },
    onChangeHandler: vi.fn(),
}

function setup(chosenGender = null) {
    render(
        <GenderInput
            {...mockProps}
            chosenGender={chosenGender}
        />
    );
};

describe("GenderInput component", () => {
    it("renders with correct value and id", () => {
        setup("Female");

        expect(screen.getByDisplayValue("Female")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Female")).toHaveAttribute("id", "femaleid");
    });

    it.each([
        { chosenGender: "Male", shouldBeChecked: false },
        { chosenGender: "Female", shouldBeChecked: true },
    ])("chosenGender $chosenGender => checked: $shouldBeChecked", ({ chosenGender, shouldBeChecked }) => {
        setup(chosenGender);


        const input = screen.getByDisplayValue("Female");

        if (shouldBeChecked) {
            expect(input).toBeChecked();
        } else {
            expect(input).not.toBeChecked();
        }
    })

    it("calls onChangeHandler when clicked", () => {
        setup("Male");


        const input = screen.getByRole("radio");

        fireEvent.click(input);

        expect(mockProps.onChangeHandler).toHaveBeenCalledTimes(1);
    });
})