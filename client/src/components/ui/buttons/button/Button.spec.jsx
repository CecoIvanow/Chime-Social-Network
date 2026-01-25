import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import userEvent from '@testing-library/user-event'

import Button from "./Button";

const buttonProps = {
    content: "Save",
    clickHandler: vi.fn(),
}

beforeEach(() => render(<Button onClickHandler={buttonProps.clickHandler} buttonName={buttonProps.content} />));

describe('Button component', () => {
    it('renders button with passed text label', () => {
        expect(screen.getByRole('button')).toHaveTextContent(buttonProps.content);
    });

    it('triggers click handler on click', async () => {
        const buttonElement = screen.getByRole('button');
        const user = userEvent.setup();
        
        user.click(buttonElement);

        await waitFor(() => expect(buttonProps.clickHandler).toHaveBeenCalled());
    });
});