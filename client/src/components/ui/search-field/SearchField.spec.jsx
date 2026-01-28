import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import SearchField from "./SearchField";

const mockSearchParams = vi.fn();

beforeEach(() => {
    render(
        <SearchField
            setSearchParams={mockSearchParams}
            searchBy="content"
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
        vi.useFakeTimers();

        const input = screen.getByTestId("search-field-input");

        fireEvent.change(input, { target: { value: "React" } });

        vi.advanceTimersByTime(1249);
        expect(mockSearchParams).toBeCalledTimes(0);

        vi.advanceTimersByTime(1);
        expect(mockSearchParams).toBeCalledWith("React");
    });

    it("Should set correct search params after multiple changes", () => {
        vi.useFakeTimers();

        const input = screen.getByTestId("search-field-input");

        fireEvent.change(input, { target: { value: "R" } });
        vi.advanceTimersByTime(1000);

        fireEvent.change(input, { target: { value: "Rea" } });
        vi.advanceTimersByTime(1200);

        fireEvent.change(input, { target: { value: "React" } });
        vi.advanceTimersByTime(1249);
        expect(mockSearchParams).not.toBeCalledWith("React");

        fireEvent.change(input, { target: { value: "Re" } });
        vi.advanceTimersByTime(1250);
        expect(mockSearchParams).toBeCalledTimes(1);
        expect(mockSearchParams).toBeCalledWith("Re");
    })
})