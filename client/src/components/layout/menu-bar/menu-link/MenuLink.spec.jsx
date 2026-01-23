import { fireEvent, getSuggestedQuery, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { MemoryRouter } from "react-router";

import MenuLink from "./MenuLink";

const LINK_URL = "/";
const LINK_TITLE = "Home"

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
});