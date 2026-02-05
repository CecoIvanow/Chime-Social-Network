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
            <LinkButton urlLink={mockProps.urlLink} buttonName={label} />
        </MemoryRouter>
    );
};

describe('LinkButton component', () => {
    it('renders button with passed label text', () => {
        setup();

        expect(screen.getByRole('button')).toHaveTextContent(mockProps.label);
    });

    it("renders button with no text label on missing prop", () => {
        setup({
            includeButtonName: false
        });

        expect(screen.getByRole('button')).toHaveTextContent('');
    });

    it('renders link with correct href attribute value', () => {
        setup();

        expect(screen.getByRole('link')).toHaveAttribute('href', mockProps.urlLink);
    });
});