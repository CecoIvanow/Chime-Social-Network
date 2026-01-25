import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Button from "./Button";

describe('LinkrButton component', () => {

    it('Should render buttonName text', () => {
        render(<Button buttonName="Save" />);

        expect(screen.getByRole('button')).toHaveTextContent('Save');
    });

    it('Should react on clicks', () => {
        const onClick = vi.fn();

        render(<Button onClickHandler={onClick} />);

        const buttonElement = screen.getByRole('button');

        fireEvent.click(buttonElement)

        expect(onClick).toBeCalled();
    });
})