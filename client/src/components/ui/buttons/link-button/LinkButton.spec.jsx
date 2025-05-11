import { MemoryRouter } from "react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LinkButton from "./LinkButton";

describe('LinkButton component', () => {
    it('Should render', () => {
        render(
            <MemoryRouter>
                <LinkButton />
            </MemoryRouter>
        );

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('Should render buttonName text', () => {
        render(
            <MemoryRouter>
                <LinkButton buttonName="Save" />
            </MemoryRouter>
        );

        expect(screen.getByRole('button')).toHaveTextContent('Save');
    });

    it('Should have passed class name', () => {
        render(
            <MemoryRouter>
                <LinkButton btnStyle="button-style" />
            </MemoryRouter>
        )

        expect(screen.getByRole('button')).toHaveClass('button-style');
    });

    it('Should have passed urlLink', () => {
        render(
            <MemoryRouter>
                <LinkButton urlLink={'/test'}/>
            </MemoryRouter>
        )

        expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
    })
})