import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import userEvent from "@testing-library/user-event";

import CreateContentInput from "./CreateContentInput";

const DEFAULT_PLACEHOLDER_TEXT = "Share your thoughts...";

const props = {
    placeholderText: "Post your comment...",
    text: "This is a test!"
};

const onTextChangeMock = vi.fn();

function setup(options = {
    hasPlaceholderTextProp: true,
}) {
    const placeholderText = options.hasPlaceholderTextProp ? props.placeholderText : null;

    render(
        <CreateContentInput
            onTextChangeHandler={onTextChangeMock}
            placeholderText={placeholderText}
            text={props.text}
        />
    );
};

describe("CreateContentInput component", () => {
    it("renders the input with the passed text value", () => {
        setup();

        expect(screen.getByRole("textbox")).toHaveValue(props.text);
    });

    it.each([
        { name: "renders the input with the passed placeholderText when provided", hasPlaceholderTextProp: true },
        { name: "renders the input with the default placeholder text when placeholderText is missing", hasPlaceholderTextProp: false },
    ])("$name", ({ hasPlaceholderTextProp }) => {
        setup({
            hasPlaceholderTextProp,
        });

        if (hasPlaceholderTextProp) {
            expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", props.placeholderText);
        } else {
            expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", DEFAULT_PLACEHOLDER_TEXT);
        };
    });

    it("links the label and input correctly via htmlFor and id attributes", () => {
        setup();

        const defaultLinkingValue = "entry";

        const label = screen.getByTestId("entry-label");
        const input = screen.getByRole("textbox");

        expect(label).toHaveAttribute("for", defaultLinkingValue);
        expect(input).toHaveAttribute("id", defaultLinkingValue);
    });

    it("renders the input with correct name and type attributes", () => {
        setup();

        const defaultTypeValue = "text";

        const input = screen.getByRole("textbox");

        expect(input).toHaveAttribute("name", defaultTypeValue);
        expect(input).toHaveAttribute("type", defaultTypeValue);
    });

    it("calls onTextChangeHandler when user types in the input", async () => {
        const user = userEvent.setup();
        setup();

        await user.type(screen.getByRole("textbox"), "Unit Test");
        expect(onTextChangeMock).toHaveBeenCalled();
    });
});