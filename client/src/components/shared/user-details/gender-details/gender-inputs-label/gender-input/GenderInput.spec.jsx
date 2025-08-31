import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GenderInput from "./GenderInput.jsx";

const onChangeHandlerMock = vi.fn();
const mockInputData = {
    value: 'Female',
    id: 'femaleid',
};

describe("GenderInput component", () => {
    it("renders with correct value and id", () => {
        render(<GenderInput
            onChangeHandler={onChangeHandlerMock}
            inputData={mockInputData}
            chosenGender={'Female'}
        />)

        expect(screen.getByDisplayValue('Female')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Female')).toHaveAttribute('id', 'femaleid');
    });

    it.each([
        { chosenGender: 'Male', shouldBeChecked: false },
        { chosenGender: 'Female', shouldBeChecked: true },
    ])("chosenGender $chosenGender => checked: $shouldBeChecked", ({ chosenGender, shouldBeChecked }) => {
        render(<GenderInput
            onChangeHandler={onChangeHandlerMock}
            inputData={mockInputData}
            chosenGender={chosenGender}
        />);

        const input = screen.getByDisplayValue('Female');

        if (shouldBeChecked) {
            expect(input).toBeChecked();
        } else {
            expect(input).not.toBeChecked();
        }
    })

    it('calls onChangeHandler when clicked', () => {
        render(<GenderInput
            onChangeHandler={onChangeHandlerMock}
            inputData={mockInputData}
            chosenGender={'Male'}
        />)

        const input = screen.getByRole('radio');

        fireEvent.click(input);

        expect(onChangeHandlerMock).toHaveBeenCalledTimes(1);
    });
})