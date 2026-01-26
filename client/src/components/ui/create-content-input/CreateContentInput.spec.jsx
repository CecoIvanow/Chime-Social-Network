import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CreateContentInput from "./CreateContentInput";

const DEFAULT_PLACEHOLDER_TEXT = "Share your thoughts...";

const createContentInputProps = {
    placeholderText: "Post your comment...",
    text: "This is a test!"
};

const onTextChangeMock = vi.fn();

function setup(options = {
    hasPlaceholderTextProp: true,
}) {
    const placeholderText = options.hasPlaceholderTextProp ? createContentInputProps.placeholderText : null;

    render(
        <CreateContentInput
            onTextChangeHandler={onTextChangeMock}
            placeholderText={placeholderText}
            text={createContentInputProps.text}
        />
    );
};

describe("CreateContentInput component", () => {
    it("links label and input correctly via default htmlFor and id attributes", () => {
        setup({
            hasPlaceholderTextProp: false
        });

        const label = screen.getByTestId("entry-label");
        const textarea = screen.getByPlaceholderText(DEFAULT_PLACEHOLDER_TEXT);

        expect(label).toHaveAttribute("for", "entry");
        expect(textarea).toHaveAttribute("id", "entry");
    });

    it("renders input with correct default value and place holder text", () => {
        setup();

        const input = screen.getByPlaceholderText(createContentInputProps.placeholderText);

        expect(input).toHaveValue(createContentInputProps.text);
        expect(input).toBeInTheDocument();
    });

    it("renders input with default name and type attributes", () => {
        setup({
            hasPlaceholderTextProp: false
        });

        const input = screen.getByPlaceholderText(DEFAULT_PLACEHOLDER_TEXT);

        expect(input).toHaveAttribute("name", "text");
        expect(input).toHaveAttribute("type", "text");
    });

    it("triggers onTextChangeHandler on user input", () => {
        setup({
            hasPlaceholderTextProp: false
        });

        const input = screen.getByPlaceholderText(DEFAULT_PLACEHOLDER_TEXT);

        expect(onTextChangeMock).not.toHaveBeenCalled();

        fireEvent.change(input, { target: { value: "Unit test" } });
        expect(onTextChangeMock).toHaveBeenCalledTimes(1);
    });
});