import { Link, MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import NotFoundPage from "./NotFoundPage";

vi.mock("./not-found-message/NotFoundMessage", () => ({
    default: () => <p data-testid="not-found-msg">Not Found</p>
}));

vi.mock("../../ui/buttons/link-button/LinkButton", () => ({
    default: ({ urlLink, buttonName }) => <Link data-testid="link-button" to={urlLink}>{buttonName}</Link>
}));

beforeEach(() => {
    render(
        <MemoryRouter>
            <NotFoundPage />
        </MemoryRouter>
    );
});

describe("NotFoundPage component", () => {
    it("renders components with passed props", () => {
        expect(screen.getByTestId("link-button")).toHaveTextContent("Home");
        expect(screen.getByTestId("link-button")).toHaveAttribute("href", '/');

        expect(screen.getByTestId("not-found-msg")).toBeInTheDocument();
    });
});