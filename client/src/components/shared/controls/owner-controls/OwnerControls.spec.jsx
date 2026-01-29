import { Link, MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../contexts/actions-context";

import OwnerControls from "./OwnerControls";

vi.mock("../../../ui/buttons/link-button/LinkButton", () => ({
    default: ({ urlLink }) => <Link>{urlLink}</Link>
}));

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName, onClickHandler }) => (
        <button
            data-testid={buttonName === "Edit" ? "edit-button" : "delete-button"}
            onClick={onClickHandler}
        >
            {buttonName}
        </button >
    )
}));

const mockProps = {
    urlLink: "Test Link",
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
    it.each([
        { name: "renders Delete Button when urlLink is provided", passUrlLink: true },
        { name: "renders Delete Button when urlLink is not provided", passUrlLink: false },
    ])("$name", ({ passUrlLink }) => {
        setup({
            passUrlLink,
        });

        expect(screen.getByTestId("delete-button")).toBeInTheDocument();
    });

    it("renders Edit LinkButton and not Edit Button when urlLink is provided", () => {
        setup();

        expect(screen.getByRole("link")).toHaveTextContent(mockProps.urlLink);
        expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    });

    it("renders Edit Button and not Edit LinkButton when urlLink is not provided", () => {
        setup({
            passUrlLink: false,
        });

        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("calls onDeleteClickHandler when Delete Button is clicked", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Delete" }));
        expect(mockHandlers.onDeleteClickHandler).toHaveBeenCalledWith(mockProps.itemId);
    });

    it("calls onEditClickHandler when Edit Button is clicked", async () => {
        const user = userEvent.setup();
        setup({
            passUrlLink: false,
        });

        await user.click(screen.getByRole("button", { name: "Edit" }));
        expect(mockHandlers.onEditClickHandler).toHaveBeenCalled();
    });
});