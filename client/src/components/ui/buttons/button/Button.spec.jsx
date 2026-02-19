import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Button from "./Button";

const mockProps = {
    label: "Save",
    onClickHandler: vi.fn(),
}

function setup(options = {
    hasTextContent: true
}) {
    const label = options.hasTextContent ? mockProps.label : null;

    render(
        <Button {...mockProps} buttonName={label} />
    );
}

describe('Button component', () => {
    it.each([
        { name: "renders button with text content", hasTextContent: true },
        { name: "renders button without text content", hasTextContent: false },
    ])("$name", ({ hasTextContent }) => {
        setup({
            hasTextContent,
        });

        if (hasTextContent) {
            expect(screen.getByRole('button')).toHaveTextContent(mockProps.label);
        } else {
            expect(screen.getByRole('button')).not.toHaveTextContent();
        };
    });

    it('triggers click handler on click', async () => {
        setup();

        const user = userEvent.setup();
        const buttonElement = screen.getByRole('button');

        user.click(buttonElement);

        await waitFor(() => expect(mockProps.onClickHandler).toHaveBeenCalled());
    });
});