import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import LinkButton from "./LinkButton";

const linkButtonProps = {
    label: "Save",
    urlLink: "/test"
}

function setup(options = {
    includeButtonName: true,
}) {
    const label = options.includeButtonName ? linkButtonProps.label : null;

    render(
        <MemoryRouter>
            <LinkButton urlLink={linkButtonProps.urlLink} buttonName={label} />
        </MemoryRouter>
    );
};

describe('LinkButton component', () => {
    it('renders button with passed label text', () => {
        setup();

        expect(screen.getByRole('button')).toHaveTextContent(linkButtonProps.label);
    });

    it("renders button with no text label on missing prop", () => {
        setup({
            includeButtonName: false
        });

        expect(screen.getByRole('button')).toHaveTextContent('');
    });

    it('renders link with correct href attribute value', () => {
        setup();

        expect(screen.getByRole('link')).toHaveAttribute('href', linkButtonProps.urlLink);
    });
});