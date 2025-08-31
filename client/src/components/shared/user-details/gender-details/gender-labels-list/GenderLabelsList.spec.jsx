import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import GenderLabelsList from "./GenderLabelsList.jsx";

vi.mock("./gender-label/GenderLabel", () => ({
    default: ({ label }) => (
        <div data-testid="gender-label">
            <span>{label.id}</span>
            <span>{label.value}</span>
            <span>{label.genderClassName}</span>
        </div>
    )
}))

beforeEach(() => {
    render(<GenderLabelsList />);
})

describe("GenderLabelsList", () => {
    it("renders with passed value, id and genderClassName props", () => {
        expect(screen.getAllByTestId('gender-label')).toHaveLength(2);

        expect(screen.getByText('Male')).toBeInTheDocument();
        expect(screen.getByText('Female')).toBeInTheDocument();

        expect(screen.getByText("dot-1")).toBeInTheDocument();
        expect(screen.getByText("dot-2")).toBeInTheDocument();

        expect(screen.getByText("one")).toBeInTheDocument();
        expect(screen.getByText("two")).toBeInTheDocument();
    });
})