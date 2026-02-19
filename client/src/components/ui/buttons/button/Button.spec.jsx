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
            expect(screen.getByRole('button', { name: mockProps.label })).toBeInTheDocument()
        } else {
            expect(screen.getByRole('button')).not.toHaveTextContent();
        };
    });

    it('triggers an event on user click', async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole('button', { name: mockProps.label }));
        await waitFor(() => expect(mockProps.onClickHandler).toHaveBeenCalled());
    });
});