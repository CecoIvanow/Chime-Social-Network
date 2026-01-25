import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LinkButton from "./LinkButton";

const linkButtonProps = {
    label: "Save",
    urlLink: "/test"
}

describe('LinkButton component', () => {

    it('Should render buttonName text', () => {
        render(
            <MemoryRouter>
                <LinkButton buttonName={linkButtonProps.label} />
            </MemoryRouter>
        );

        expect(screen.getByRole('button')).toHaveTextContent(linkButtonProps.label);
    });

    it('Should have passed urlLink', () => {
        render(
            <MemoryRouter>
                <LinkButton urlLink={linkButtonProps.urlLink}/>
            </MemoryRouter>
        )

        expect(screen.getByRole('link')).toHaveAttribute('href', linkButtonProps.urlLink);
    })
})