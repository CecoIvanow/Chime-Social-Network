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