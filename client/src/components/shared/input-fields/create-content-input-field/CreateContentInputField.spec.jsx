import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CreateContentInputField from "./CreateContentInputField";

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName }) => (
        <button type="submit">
            {buttonName}
        </button>
    )
}));

vi.mock("../../../ui/create-content-input/CreateContentInput", () => ({
    default: ({ text, placeholderText, onTextChangeHandler }) => <>
        <label htmlFor="input"></label>
        <input
            id="input"
            name="input"
            onChange={onTextChangeHandler}
            placeholder={placeholderText}
            value={text}
        />
    </>
}));

const mockProps = {
    placeholderText: 'Share your thoughts...',
    buttonText: 'Post',
    text: 'Hello!',
    onTextChangeHandler: vi.fn(),
    onSubmitHandler: vi.fn(),
};

beforeEach(() => {
    render(
        <CreateContentInputField
            {...mockProps}
        />
    );
});

describe('CreateContentInputField component', () => {
    it('renders Button and CreateContentInput with provided props', () => {
        expect(screen.getByRole("button")).toHaveTextContent(mockProps.buttonText);

        expect(screen.getByPlaceholderText(mockProps.placeholderText)).toHaveValue(mockProps.text);
    });

    it('onTextChangeHandler gets called on text change', () => {
        const createContentInput = screen.getByDisplayValue(mockProps.text);

        expect(mockProps.onTextChangeHandler).toHaveBeenCalledTimes(0);

        fireEvent.change(createContentInput, { target: { value: 'Hello, there!' } })
        expect(mockProps.onTextChangeHandler).toHaveBeenCalledTimes(1);
    });

    it('onSubmitHandler gets called on submit', () => {
        expect(mockProps.onSubmitHandler).toHaveBeenCalledTimes(0);

        fireEvent.submit(screen.getByTestId('form-action-submit'));
        expect(mockProps.onSubmitHandler).toHaveBeenCalledTimes(1);
    });
});