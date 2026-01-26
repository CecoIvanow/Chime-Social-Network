import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CreateContentInput from "./CreateContentInput";

const onTextChangeMock = vi.fn();

function setup(options = {
    hasPlaceholderTextProp: true,
}) {
    const placeholderText = options.hasPlaceholderTextProp ? "Post your comment..." : null;

    render(
        <CreateContentInput
            onTextChangeHandler={onTextChangeMock}
            placeholderText={placeholderText}
            text={'Testing text!'}
        />
    );
};

describe('CreateContentInput', () => {
    it("links label and input correctly via htmlFor and id", () => {
        setup({
            hasPlaceholderTextProp: false
        });

        const label = screen.getByTestId('entry-label');
        const textarea = screen.getByPlaceholderText('Share your thoughts...');

        expect(label).toHaveAttribute('for', 'entry');
        expect(textarea).toHaveAttribute('id', 'entry');
    });

    it('renders input with correct default value and place holder text', () => {
        setup();

        const input = screen.getByPlaceholderText('Post your comment...');

        expect(input).toHaveValue('Testing text!');
        expect(input).toBeInTheDocument();
    });

    it('renders input with default name and type attributes', () => {
        setup({
            hasPlaceholderTextProp: false
        });

        const input = screen.getByPlaceholderText('Share your thoughts...');

        expect(input).toHaveAttribute('name', 'text');
        expect(input).toHaveAttribute('type', 'text');
    });

    it('on text change handler gets called on change', () => {
        setup({
            hasPlaceholderTextProp: false
        });

        const input = screen.getByPlaceholderText("Share your thoughts...");

        expect(onTextChangeMock).not.toHaveBeenCalled();

        fireEvent.change(input, { target: { value: 'Unit test' } });
        expect(onTextChangeMock).toHaveBeenCalledTimes(1);
    });
});