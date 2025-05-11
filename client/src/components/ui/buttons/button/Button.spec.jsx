import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import Button from "./Button";

describe('Button component', () => {
    it('Vitest configure test', () => {
        expect(true).toBe(true);
    });

    it('Testing Library Configure test', () => {
        render(<Button/>);

        const buttonElement = screen.getByRole('button');

        expect(buttonElement).toBeInTheDocument();
    });
})