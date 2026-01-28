import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import userEvent from '@testing-library/user-event'

import Button from "./Button";

const mockProps = {
    label: "Save",
    clickHandler: vi.fn(),
}

function setup(options={
    hasTextContent: true
}) {
    const label = options.hasTextContent ?
    mockProps.label :
    null;

    render(
        <Button onClickHandler={mockProps.clickHandler} buttonName={label} />
    );
}

describe('Button component', () => {
    it('renders button with passed text label', () => {
        setup();

        expect(screen.getByRole('button')).toHaveTextContent(mockProps.label);
    });

    it("renders button with empty text label on missing prop", () => {
        setup({
            hasTextContent: false
        });

        expect(screen.getByRole('button')).toHaveTextContent("");

    });

    it('triggers click handler on click', async () => {
        setup();
        
        const user = userEvent.setup();
        const buttonElement = screen.getByRole('button');
        
        user.click(buttonElement);

        await waitFor(() => expect(mockProps.clickHandler).toHaveBeenCalled());
    });
});