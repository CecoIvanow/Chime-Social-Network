import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CreateContentInput from "./CreateContentInput";

describe('CreateContentInput', () => {
    it('renders with entry-header container, label and input', () => {
        render(<CreateContentInput />);

        const entryHeader = screen.getByTestId('entry-header');
        const label = screen.getByTestId('entry-label');
        const input = screen.getByPlaceholderText('Share your thoughts...');

        expect(entryHeader).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toBeInTheDocument();
    });

    it("links label and input correctly via htmlFor and id", () => {
        render(<CreateContentInput />)

        const label = screen.getByTestId('entry-label');
        const textarea = screen.getByPlaceholderText('Share your thoughts...');

        expect(label).toHaveAttribute('for', 'entry');
        expect(textarea).toHaveAttribute('id', 'entry');
    })

    it('renders input with correct default value and place holder text', () => {
        render(<CreateContentInput
            placeholderText={'Post your comment'}
            text={'Testing text!'}
        />);

        const input = screen.getByPlaceholderText('Post your comment');

        expect(input).toHaveValue('Testing text!');
        expect(input).toBeInTheDocument();
    });

    it('renders input with default name and type attributes', () => {
        render(<CreateContentInput />);

        const input = screen.getByPlaceholderText('Share your thoughts...');

        expect(input).toHaveAttribute('name', 'text');
        expect(input).toHaveAttribute('type', 'text');
    })

    it('on text change handler gets called on change', () => {
        const onTextChangeMock = vi.fn();

        render(<CreateContentInput 
            onTextChangeHandler={onTextChangeMock}
        />)

        const input = screen.getByPlaceholderText("Share your thoughts...");

        expect(onTextChangeMock).not.toHaveBeenCalled();

        fireEvent.change(input, { target: {value: 'Unit test'} });
        expect(onTextChangeMock).toHaveBeenCalledTimes(1);
    })
});