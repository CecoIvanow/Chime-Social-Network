import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import GenderDetails from "./GenderDetails.jsx";

vi.mock("./gender-inputs-label/GenderInputsLabel", () => ({
    default: ({userGender}) => <div data-testid="gender-inputs-label" >{userGender}</div>
}));

vi.mock("../gender-header-title/GenderHeaderTitle", () => ({
    default: () => <div data-testid="gender-header-title" >Gender</div>
}));

vi.mock("./gender-labels-list/GenderLabelsList", () => ({
    default: () => <div data-testid="gender-labels-list" ></div>
}));

beforeEach(() => {
    render(<GenderDetails userGender={"Male"}/>);
});

describe("GenderDetails component", () => {
    it("renders the gender header title and gender labels", () => {
        expect(screen.getByTestId("gender-header-title")).toBeInTheDocument();
        expect(screen.getByTestId("gender-labels-list")).toBeInTheDocument();
    });

    it("renders the gender input labels with the chosen user gender", () => {
        expect(screen.getByTestId("gender-inputs-label")).toHaveTextContent("Male");
    });
});