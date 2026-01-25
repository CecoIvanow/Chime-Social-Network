import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import userEvent from '@testing-library/user-event'

import Button from "./Button";

const buttonProps = {
    content: "Save",
    onClick: vi.fn(),
}

beforeEach(() => render(<Button onClickHandler={buttonProps.onClick} buttonName={buttonProps.content} />));

describe('LinkrButton component', () => {
    it('Should render buttonName text', () => {
        expect(screen.getByRole('button')).toHaveTextContent(buttonProps.content);
    });

    it('Should react on clicks', async () => {
        const user = userEvent.setup();

        const buttonElement = screen.getByRole('button');

        user.click(buttonElement);

        await waitFor(() => expect(buttonProps.onClick).toHaveBeenCalled());
    });
})