import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CreateContentInputField from "./CreateContentInputField";

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName }) => (
        <button>
            {buttonName}
        </button>
    )
}))

vi.mock("../../../ui/create-content-input/CreateContentInput", () => ({
    default: ({ text, placeholderText, onTextChangeHandler }) => (
        <input
            onChange={onTextChangeHandler}
            placeholder={placeholderText}
            value={text}
        />
    )
}))

const mockedProps = {
    placeholderText: 'Share your thoughts...',
    buttonText: 'Post',
    text: 'Hello!',
    onTextChangeHandler: vi.fn(),
    onSubmitHandler: vi.fn(),
}

beforeEach(() => {
    render(
        <CreateContentInputField
            buttonText={mockedProps.buttonText}
            placeholderText={mockedProps.placeholderText}
            text={mockedProps.text}
            onTextChangeHandler={mockedProps.onTextChangeHandler}
            onSubmitHandler={mockedProps.onSubmitHandler}
        />
    );
})

describe('CreateContentInputField component', () => {
    it('renders Button and CreateContentInput with passed props', () => {

        expect(screen.getByText(mockedProps.buttonText)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockedProps.text)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(mockedProps.placeholderText)).toBeInTheDocument();
    });

    it('onTextChangeHandler gets called on text change', () => {
        const createContentInput = screen.getByDisplayValue(mockedProps.text);

        expect(mockedProps.onTextChangeHandler).toHaveBeenCalledTimes(0);

        fireEvent.change(createContentInput, { target: { value: 'Hello, there!' } })
        expect(mockedProps.onTextChangeHandler).toHaveBeenCalledTimes(1);
    });

    it('onSubmitHandler gets called on submit', () => {
        expect(mockedProps.onSubmitHandler).toHaveBeenCalledTimes(0);

        fireEvent.submit(screen.getByTestId('form-action-submit'));
        expect(mockedProps.onSubmitHandler).toHaveBeenCalledTimes(1);
    })
})