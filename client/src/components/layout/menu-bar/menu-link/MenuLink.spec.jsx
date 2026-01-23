import { fireEvent, getSuggestedQuery, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { MemoryRouter } from "react-router";

import MenuLink from "./MenuLink";

const LINK_URL = "/";
const LINK_TITLE = "Home";
const IMAGE_URI = "image.png";
const IMAGE_ALT = "image";
const LINK_TEXT = "Test123";

describe("MenuLink component", () => {
    it("renders component with passed props", () => {
        render(
            <MemoryRouter>
                <MenuLink
                    linkUrl={LINK_URL}
                    linkTitle={LINK_TITLE}
                />
            </MemoryRouter>
        );

        expect(screen.getByRole("link")).toHaveAttribute("href", LINK_URL);
        expect(screen.getByRole("link")).toHaveAttribute("title", LINK_TITLE);
    });

    it("renders an image on passed linkImageUri", () => {
        render(
            <MemoryRouter>
                <MenuLink
                    linkImageUri={IMAGE_URI}
                    linkImageAlt={IMAGE_ALT}
                />
            </MemoryRouter>
        );

        expect(screen.getByRole("img")).toHaveAttribute("src", IMAGE_URI);
        expect(screen.getByRole("img")).toHaveAttribute("alt", IMAGE_ALT);

        expect(screen.getByRole("link")).not.toHaveTextContent(LINK_TEXT);
    });
});