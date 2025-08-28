import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import CreateContentInputField from "./CreateContentInputField.jsx";

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName }) => (
        <button>
            {buttonName}
        </button>
    )
}));

vi.mock("../../../ui/create-content-input/CreateContentInput", () => ({
    default: ({ onTextChangeHandler, placeholderText, text }) => (
        <input
            data-testid="content-input"
            placeholder={placeholderText}
            value={text}
            onChange={(e) => onTextChangeHandler(e)}
        />
    )
}));

const mockFunctions = {
    submitAction: vi.fn(),
    onChangeAction: vi.fn(),
}

const mockProps = {
    placeholderText: 'Input your text here!',
    text: '123',
    buttonText: 'Save'
}

beforeEach(() => {
    vi.clearAllMocks();

    render(<CreateContentInputField
        onSubmitHandler={mockFunctions.submitAction}
        onTextChangeHandler={mockFunctions.onChangeAction}
        buttonText={mockProps.buttonText}
        placeholderText={mockProps.placeholderText}
        text={mockProps.text}
    />)
})

describe('CreateContentInput component', () => {
    it('renders with child components', () => {
        expect(screen.getByText(mockProps.buttonText)).toBeInTheDocument();

        expect(screen.getByPlaceholderText(mockProps.placeholderText)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockProps.text)).toBeInTheDocument();
    });

    it('form action fires on submit', () => {
        fireEvent.submit(screen.getByTestId('content-form'));

        expect(mockFunctions.submitAction).toHaveBeenCalledTimes(1);
    });

    it('calls onTextChangeHandler when input changes', () => {
        const input = screen.getByTestId('content-input');
        fireEvent.change(input, { target: { value: 'new value' }});

        expect(mockFunctions.onChangeAction).toHaveBeenCalledTimes(1);
    });
})