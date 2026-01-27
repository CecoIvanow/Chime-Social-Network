import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";

import LinkButton from "./LinkButton";

const props = {
    label: "Save",
    urlLink: "/test"
}

function setup(options = {
    includeButtonName: true,
}) {
    const label = options.includeButtonName ? props.label : null;

    render(
        <MemoryRouter>
            <LinkButton urlLink={props.urlLink} buttonName={label} />
        </MemoryRouter>
    );
};

describe('LinkButton component', () => {
    it('renders button with passed label text', () => {
        setup();

        expect(screen.getByRole('button')).toHaveTextContent(props.label);
    });

    it("renders button with no text label on missing prop", () => {
        setup({
            includeButtonName: false
        });

        expect(screen.getByRole('button')).toHaveTextContent('');
    });

    it('renders link with correct href attribute value', () => {
        setup();

        expect(screen.getByRole('link')).toHaveAttribute('href', props.urlLink);
    });
});