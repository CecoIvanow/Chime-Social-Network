import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MemoryRouter } from "react-router";

import MenuLink from "./MenuLink";

const LINK_URL = "/";
const LINK_TITLE = "Home";
const IMAGE_URI = "image.png";
const IMAGE_ALT = "image";
const LINK_TEXT = "Test123";

describe("MenuLink component", () => {
    it("renders menu link with correct href and title attributes", () => {
        render(
            <MemoryRouter>
                <MenuLink
                    linkUrl={LINK_URL}
                    linkTitle={LINK_TITLE}
                />
            </MemoryRouter>
        );

        expect(screen.getByRole("link", { name: LINK_TITLE})).toHaveAttribute("href", LINK_URL);
    });

    it("renders menu link image with correct text content and src and alt attributes instead of text content", () => {
        render(
            <MemoryRouter>
                <MenuLink
                    linkImageUri={IMAGE_URI}
                    linkImageAlt={IMAGE_ALT}
                />
            </MemoryRouter>
        );

        expect(screen.getByRole("img", { name: IMAGE_ALT})).toHaveAttribute("src", IMAGE_URI);
        expect(screen.getByRole("link")).not.toHaveTextContent(LINK_TEXT);
    });

    it("renders menu link with correct text content instead of image", () => {
        render(
            <MemoryRouter>
                <MenuLink
                    linkText={LINK_TEXT}
                />
            </MemoryRouter>
        );

        expect(screen.getByRole("link")).toHaveTextContent(LINK_TEXT);
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
});