import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CreateContentInput from "./CreateContentInput";

const DEFAULT_PLACEHOLDER_TEXT = "Share your thoughts...";

const mockProps = {
    placeholderText: "Post your comment...",
    text: "This is a test!",
    onTextChangeHandler: vi.fn(),
};

function setup(options = {
    hasPlaceholderTextProp: true,
}) {
    const placeholderText = options.hasPlaceholderTextProp ? mockProps.placeholderText : null;

    render(
        <CreateContentInput
            {...mockProps}
            placeholderText={placeholderText}
        />
    );
};

describe("CreateContentInput component", () => {
    it("renders the input with the correct text value", () => {
        setup();

        expect(screen.getByRole("textbox", { value: mockProps.text })).toBeInTheDocument();
    });

    it.each([
        { name: "renders the input with the given placeholder", hasPlaceholderTextProp: true },
        { name: "renders the input with the default hardcoded placeholder text when no other text is given", hasPlaceholderTextProp: false },
    ])("$name", ({ hasPlaceholderTextProp }) => {
        setup({
            hasPlaceholderTextProp,
        });

        if (hasPlaceholderTextProp) {
            expect(screen.getByRole("textbox", { value: mockProps.text })).toHaveAttribute("placeholder", mockProps.placeholderText);
        } else {
            expect(screen.getByRole("textbox", { value: mockProps.text })).toHaveAttribute("placeholder", DEFAULT_PLACEHOLDER_TEXT);
        };
    });

    it("links the label and input correctly via htmlFor and id attributes", () => {
        setup();

        const defaultLinkingValue = "entry";

        expect(screen.getByTestId("entry-label")).toHaveAttribute("for", defaultLinkingValue);
        expect(screen.getByRole("textbox", { value: mockProps.text })).toHaveAttribute("id", defaultLinkingValue);
    });

    it("renders the input with the correct name and type attributes", () => {
        setup();

        const defaultTypeValue = "text";

        expect(screen.getByRole("textbox", { value: mockProps.text })).toHaveAttribute("name", defaultTypeValue);
        expect(screen.getByRole("textbox", { value: mockProps.text })).toHaveAttribute("type", defaultTypeValue);
    });

    it("triggers an event on user typing", async () => {
        const user = userEvent.setup();
        setup();

        await user.type(screen.getByRole("textbox", { value: mockProps.text }), "Unit Test");
        expect(mockProps.onTextChangeHandler).toHaveBeenCalled();
    });
});