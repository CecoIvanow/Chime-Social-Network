import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import SearchField from "./SearchField";

const mockProps = {
    setSearchParams: vi.fn(),
    searchBy: "content",
}

beforeEach(() => {
    vi.useFakeTimers();

    render(
        <SearchField
            {...mockProps}
        />
    );
});

describe("SearchField component", () => {
    it("Should render search field container with input", () => {
        expect(screen.getByTestId("search-field-container")).toBeInTheDocument();
        expect(screen.getByTestId("search-field-input")).toBeInTheDocument();
    });

    it("Should render search field input with passed searchBy placeholder text", () => {
        expect(screen.getByPlaceholderText("Search by content...")).toBeInTheDocument();
    });

    it("Should set correct search params after 1250 ms on change", () => {
        const input = screen.getByRole("textbox");

        fireEvent.change(input, { target: { value: "React" } });

        vi.advanceTimersByTime(1249);
        expect(mockProps.setSearchParams).toBeCalledTimes(0);

        vi.advanceTimersByTime(1);
        expect(mockProps.setSearchParams).toBeCalledWith("React");
    });

    it("Should set correct search params after multiple changes", () => {
        const input = screen.getByRole("textbox");

        fireEvent.change(input, { target: { value: "R" } });
        vi.advanceTimersByTime(1000);

        fireEvent.change(input, { target: { value: "Rea" } });
        vi.advanceTimersByTime(1200);

        fireEvent.change(input, { target: { value: "React" } });
        vi.advanceTimersByTime(1249);
        expect(mockProps.setSearchParams).not.toBeCalledWith("React");

        fireEvent.change(input, { target: { value: "Re" } });
        vi.advanceTimersByTime(1250);
        expect(mockProps.setSearchParams).toBeCalledTimes(1);
        expect(mockProps.setSearchParams).toBeCalledWith("Re");
    })
})