import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Button from "./Button";

const buttonProps = {
    content: "Save",
    onClick: vi.fn(),
}

describe('LinkrButton component', () => {
    it('Should render buttonName text', () => {
        render(<Button buttonName={buttonProps.content} />);

        expect(screen.getByRole('button')).toHaveTextContent(buttonProps.content);
    });

    it('Should react on clicks', () => {
        render(<Button onClickHandler={buttonProps.onClick} />);

        const buttonElement = screen.getByRole('button');

        fireEvent.click(buttonElement)

        expect(buttonProps.onClick).toBeCalled();
    });
})