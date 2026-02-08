import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import GenderLabel from "./GenderLabel.jsx";

const mockLabel = {
    id: 'femaleId',
    value: 'Female',
    genderClassName: 'female',
};

beforeEach(() => {
    render(<GenderLabel label={mockLabel} />)
});

describe("GenderLabel component", () => {
    it("renders with passed props", () => {
        const label = screen.getByTestId('gender-label')

        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute('for', 'femaleId');

        expect(screen.getByText('Female')).toBeInTheDocument();

        expect(screen.getByTestId('gender-class')).toBeInTheDocument();

        expect(screen.getByTestId('gender-class')).toHaveClass('dot', 'female');
    });
});