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
    it("links label and input correctly via hardcoded htmlFor and id attributes", () => {
        setup({
            hasPlaceholderTextProp: false
        });

        const defaultLinkingValue = "entry";

        const label = screen.getByTestId("entry-label");
        const input = screen.getByRole("textbox");

        expect(label).toHaveAttribute("for", defaultLinkingValue);
        expect(input).toHaveAttribute("id", defaultLinkingValue);
    });

    it("renders input with correct default value and place holder text", () => {
        setup();

        const input = screen.getByRole("textbox");


        expect(input).toHaveValue(createContentInputProps.text);
        expect(input).toBeInTheDocument();
    });

    it("renders input with hardcoded name and type attributes", () => {
        setup({
            hasPlaceholderTextProp: false
        });

        const defaultTypeValue = "text";

        const input = screen.getByRole("textbox");

        expect(input).toHaveAttribute("name", defaultTypeValue);
        expect(input).toHaveAttribute("type", defaultTypeValue);
    });

    it("triggers onTextChangeHandler on user input", () => {
        setup({
            hasPlaceholderTextProp: false
        });

        const input = screen.getByRole("textbox");

        expect(onTextChangeMock).not.toHaveBeenCalled();

        fireEvent.change(input, { target: { value: "Unit test" } });
        expect(onTextChangeMock).toHaveBeenCalledTimes(1);
    });
});