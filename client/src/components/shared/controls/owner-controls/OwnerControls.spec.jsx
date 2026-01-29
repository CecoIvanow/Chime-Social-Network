import { Link, MemoryRouter } from "react-router";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../contexts/actions-context";

import OwnerControls from "./OwnerControls";

vi.mock("../../../ui/buttons/link-button/LinkButton", () => ({
    default: ({ urlLink }) => <Link>{urlLink}</Link>
}));

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName, onClickHandler }) => (
        <div
            data-testid={buttonName === "Edit" ? "edit-button" : "delete-button"}
            onClick={onClickHandler}
        >
            {buttonName}
        </div >
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

    it("renders Edit LinkButton when urlLink is provided", () => {
        setup();

        expect(screen.getByRole("link")).toBeInTheDocument();
        expect(screen.getByText(mockProps.urlLink)).toBeInTheDocument();

        expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
    });

    it("renders Edit Button when urlLink is not provided", () => {
        setup({
            passUrlLink: false,
        });

        expect(screen.getByTestId("edit-button")).toBeInTheDocument();

        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("Cancel and Edit Buttons react on clicks", () => {
        setup({
            passUrlLink: false,
        })

        fireEvent.click(screen.getByTestId("delete-button"));
        expect(screen.getByTestId("delete-button")).toBeInTheDocument();
        expect(mockHandlers.onDeleteClickHandler).toBeCalledTimes(1);
        expect(mockHandlers.onDeleteClickHandler).toHaveBeenCalledWith(mockProps.itemId);

        fireEvent.click(screen.getByTestId("edit-button"));
        expect(screen.getByTestId("edit-button")).toBeInTheDocument();
        expect(mockHandlers.onEditClickHandler).toBeCalledTimes(1);
    });
});