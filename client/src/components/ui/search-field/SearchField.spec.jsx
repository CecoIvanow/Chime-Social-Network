import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import SearchField from "./SearchField";

const mockProps = {
    setSearchParams: vi.fn(),
    searchBy: "content",
};

beforeEach(() => {
    vi.useFakeTimers();

    render(
        <SearchField
            {...mockProps}
        />
    );
});

// * fireEvent is used here due to vi.useFakeTimers and userEvent Issue #1115 in testing-library/user-event github repo
// * https://github.com/testing-library/user-event/issues/1115

describe("SearchField component", () => {
    it("renders input with the placeholder and type attributes", () => {
        expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", `Search by ${mockProps.searchBy}...`);
        expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
    });

    it("calls setSearchParams after 1250 ms have passed on value change", () => {
        const newValue = "React";

        fireEvent.change(screen.getByRole("textbox"), { target: { value: newValue } });

        vi.advanceTimersByTime(1249);
        expect(mockProps.setSearchParams).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(mockProps.setSearchParams).toHaveBeenCalledWith(newValue);
    });

    it("resets timer and does not call setSearchParams after value changes before 1250ms have passed", () => {
        const input = screen.getByRole("textbox");

        fireEvent.change(input, { target: { value: "Test" } });
        vi.advanceTimersByTime(1000);

        fireEvent.change(input, { target: { value: "Test123" } });
        vi.advanceTimersByTime(1249);
        expect(mockProps.setSearchParams).not.toHaveBeenCalled();

        fireEvent.change(input, { target: { value: "Surprise!" } });
        vi.advanceTimersByTime(1250);
        expect(mockProps.setSearchParams).toHaveBeenCalledWith("Surprise!");
    });
});