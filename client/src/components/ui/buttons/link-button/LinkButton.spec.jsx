import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LinkButton from "./LinkButton";

const mockProps = {
    label: "Save",
    urlLink: "/test"
}

function setup(options = {
    includeButtonName: true,
}) {
    const label = options.includeButtonName ? mockProps.label : null;

    render(
        <MemoryRouter>
            <LinkButton {...mockProps} buttonName={label} />
        </MemoryRouter>
    );
};

describe("LinkButton component", () => {
    it.each([
        { name: "renders link button with text content", includeButtonName: true },
        { name: "renders link button without text content", includeButtonName: false },
    ])("$name", ({ includeButtonName }) => {
        setup({
            includeButtonName,
        });

        if (includeButtonName) {
            expect(screen.getByRole("button", { name: mockProps.label })).toBeInTheDocument();
        } else {
            expect(screen.getByRole("button")).not.toHaveTextContent();
        };
    });

    it("renders link with correct href attribute value", () => {
        setup();

        expect(screen.getByRole("link")).toHaveAttribute("href", mockProps.urlLink);
    });
});