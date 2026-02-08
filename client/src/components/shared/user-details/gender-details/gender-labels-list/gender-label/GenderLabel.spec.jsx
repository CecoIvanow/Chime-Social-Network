import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import GenderLabel from "./GenderLabel.jsx";

const mockProps = {
    label: {
        id: 'femaleId',
        value: 'Female',
    }
};

beforeEach(() => {
    render(<GenderLabel {...mockProps} />)
});

describe("GenderLabel component", () => {
    it("renders label with correct value and for attributes", () => {
        expect(screen.getByTestId('gender-label')).toHaveAttribute('for', mockProps.label.id);

        expect(screen.getByText(mockProps.label.value)).toBeInTheDocument();
    });
});