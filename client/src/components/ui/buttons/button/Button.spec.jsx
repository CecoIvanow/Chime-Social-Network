import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

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

    it('Should react on clicks', () => {
        const buttonElement = screen.getByRole('button');

        fireEvent.click(buttonElement)

        expect(buttonProps.onClick).toBeCalled();
    });
})