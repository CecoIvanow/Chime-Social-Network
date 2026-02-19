import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
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
    placeholderText: "Share your thoughts...",
    buttonText: "Post",
    text: "Hello!",
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

describe("CreateContentInputField component", () => {
    it("renders button with correct text value", () => {
        expect(screen.getByRole("button")).toHaveTextContent(mockProps.buttonText);
    });

    it("input for content creation with correct text and placeholder attributes", () => {
        expect(screen.getByPlaceholderText(mockProps.placeholderText)).toHaveValue(mockProps.text);
    });

    it("triggers a text change event on user input typing", async () => {
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText(mockProps.placeholderText), "Hello, there!");
        expect(mockProps.onTextChangeHandler).toHaveBeenCalled();
    });

    it("triggers a submit event when the form gets submitted", async () => {
        const user = userEvent.setup();

        await user.click(screen.getByRole("button"));
        expect(mockProps.onSubmitHandler).toHaveBeenCalled();
    });
});