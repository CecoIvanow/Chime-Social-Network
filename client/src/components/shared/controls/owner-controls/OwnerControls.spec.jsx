import { Link, MemoryRouter } from "react-router";

import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../contexts/actions-context";

import OwnerControls from "./OwnerControls";

vi.mock("../../../ui/buttons/link-button/LinkButton", () => ({
    default: ({ urlLink }) => <Link to={urlLink}></Link>
}));

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName, onClickHandler }) => <button onClick={onClickHandler}>{buttonName}</button >
}));

const mockProps = {
    urlLink: "/test-link",
    itemId: 5,
};

const mockHandlers = {
    onDeleteClickHandler: vi.fn(),
    onEditClickHandler: vi.fn(),
};

function setup(options = {
    passUrlLink: true,
}) {
    const urlLinkProp = options.passUrlLink ? mockProps.urlLink : null;

    render(
        <MemoryRouter>
            <ActionsContext.Provider value={{ ...mockHandlers }}>
                <OwnerControls
                    urlLink={urlLinkProp}
                    itemId={mockProps.itemId}
                />
            </ActionsContext.Provider>
        </MemoryRouter>
    );
};

describe("OwnerControls component", () => {
    it("renders Delete button on mount", () => {
        setup();

        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    });

    it("renders Edit link button instead of normal button when link has been provided", () => {
        setup();

        expect(screen.getByRole("link", { value: "Edit" })).toHaveAttribute("href", mockProps.urlLink);
        expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    });

    it("renders Edit button instead of link button when link has not been provided", () => {
        setup({
            passUrlLink: false,
        });

        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("triggers a delete event when Delete button is clicked", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Delete" }));
        expect(mockHandlers.onDeleteClickHandler).toHaveBeenCalledWith(mockProps.itemId);
    });

    it("triggers an edit event when Edit button is clicked", async () => {
        const user = userEvent.setup();
        setup({
            passUrlLink: false,
        });

        await user.click(screen.getByRole("button", { name: "Edit" }));
        expect(mockHandlers.onEditClickHandler).toHaveBeenCalled();
    });
});