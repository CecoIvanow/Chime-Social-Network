import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
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
    it("renders input with correct value, name and id attributes", () => {
        setup("Female");

        expect(screen.getByDisplayValue("Female")).toHaveAttribute("id", "femaleid");
        expect(screen.getByDisplayValue("Female")).toHaveAttribute("name", "gender");
    });

    it.each([
        { name: "default Male gender is chosern on render", chosenGender: "Male", shouldBeChecked: false },
        { name: "default Female gender is chosern on render", chosenGender: "Female", shouldBeChecked: true },
    ])("$name", ({ chosenGender, shouldBeChecked }) => {
        setup(chosenGender);

        const input = screen.getByRole("radio");

        if (shouldBeChecked) {
            expect(input).toBeChecked();
        } else {
            expect(input).not.toBeChecked();
        }
    })

    it("radio input triggers an event after user click", async () => {
        const user = userEvent.setup();
        setup("Male");

        await user.click(screen.getByRole("radio"));

        expect(mockProps.onChangeHandler).toHaveBeenCalledTimes(1);
    });
})