import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import userEvent from '@testing-library/user-event'

import Button from "./Button";

const buttonProps = {
    content: "Save",
    clickHandler: vi.fn(),
}

function setup(options={
    hasTextContent: true
}) {
    const content = options.hasTextContent ?
    buttonProps.content :
    null;

    render(
        <Button onClickHandler={buttonProps.clickHandler} buttonName={content} />
    );
}

describe('Button component', () => {
    it('renders button with passed text label', () => {
        setup();

        expect(screen.getByRole('button')).toHaveTextContent(buttonProps.content);
    });

    it('triggers click handler on click', async () => {
        setup();
        
        const user = userEvent.setup();
        const buttonElement = screen.getByRole('button');
        
        user.click(buttonElement);

        await waitFor(() => expect(buttonProps.clickHandler).toHaveBeenCalled());
    });
});