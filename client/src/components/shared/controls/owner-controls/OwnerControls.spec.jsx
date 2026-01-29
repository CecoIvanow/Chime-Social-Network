import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../contexts/actions-context";

import OwnerControls from "./OwnerControls";

vi.mock("../../../ui/buttons/link-button/LinkButton", () => ({
    default: ({ urlLink }) => (
        <div data-testid="edit-link-button">
            <span>{urlLink}</span>
        </div>
    )
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
    hasUrlLink: true,
}) {
    const urlLinkProp = options.hasUrlLink ? mockProps.urlLink : null;

    const { rerender } = render(
        <ActionsContext.Provider value={{ ...mockHandlers }}>
            <OwnerControls
                urlLink={urlLinkProp}
                itemId={mockProps.itemId}
            />
        </ActionsContext.Provider>
    );

    return { rerender };
};

describe("OwnerControls component", () => {
    it("renders Delete Button component always, regardless of props", () => {
        const { rerender } = setup();

        expect(screen.getByTestId("delete-button")).toBeInTheDocument();

        rerender(
            <ActionsContext.Provider value={{ ...mockHandlers }}>
                <OwnerControls />
            </ActionsContext.Provider>
        );

        expect(screen.getByTestId("delete-button")).toBeInTheDocument();
    });

    it("renders Edit LinkButton when urlLink is provided", () => {
        setup();

        expect(screen.getByTestId("edit-link-button")).toBeInTheDocument();
        expect(screen.getByText(mockProps.urlLink)).toBeInTheDocument();

        expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
    });

    it("renders Edit Button when urlLink is not provided", () => {
        setup({
            hasUrlLink: false,
        });

        expect(screen.getByTestId("edit-button")).toBeInTheDocument();

        expect(screen.queryByTestId("edit-link-button")).not.toBeInTheDocument();
    });

    it("Cancel and Edit Buttons react on clicks", () => {
        setup({
            hasUrlLink: false,
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