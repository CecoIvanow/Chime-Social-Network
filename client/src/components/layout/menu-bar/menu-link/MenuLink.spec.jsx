import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MemoryRouter } from "react-router";

import MenuLink from "./MenuLink";

const mockProps = {
    linkUrl: "/",
    linkTitle: "Home",
    linkImageUri: "image.png",
    linkImageAlt: "image",
    linkText: "Test123",
};

function setup(options = {
    renderWithImage: true,
}) {
    const updatedProps = { ...mockProps };

    if (options.renderWithImage) {
        updatedProps.linkText = null;
    } else {
        updatedProps.linkImageUri = null;
        updatedProps.linkImageAlt = null;
    }

    render(
        <MemoryRouter>
            <MenuLink {...updatedProps} />
        </MemoryRouter>
    );
}

describe("MenuLink component", () => {
    it("renders menu link with correct href and title attributes", () => {
        setup();

        expect(screen.getByRole("link")).toHaveAttribute("href", mockProps.linkUrl);
        expect(screen.getByRole("link")).toHaveAttribute("title", mockProps.linkTitle);
    });

    it("renders menu link image with correct text content and src and alt attributes instead of text content", () => {
        setup();

        expect(screen.getByRole("img", { name: mockProps.linkImageAlt })).toHaveAttribute("src", mockProps.linkImageUri);
        expect(screen.getByRole("link")).not.toHaveTextContent();
    });

    it("renders menu link with correct text content instead of image", () => {
        setup({
            renderWithImage: false,
        })

        expect(screen.getByRole("link")).toHaveTextContent(mockProps.linkText);
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
});