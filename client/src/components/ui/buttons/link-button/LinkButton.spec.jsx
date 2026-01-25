import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
    it('Should render buttonName text', () => {
        setup();

        expect(screen.getByRole('button')).toHaveTextContent(linkButtonProps.label);
    });

    it('Should have passed urlLink', () => {
        setup();

        expect(screen.getByRole('link')).toHaveAttribute('href', linkButtonProps.urlLink);
    })
})