import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../contexts/actions-context";

import OwnerButtons from "./OwnerButtons";

vi.mock("../edit-controls/EditControls", () => ({
    default: ({ itemId }) => (
        <div data-testid="edit-controls">
            <div>{itemId}</div>
        </div>
    )
}));

vi.mock("../owner-controls/OwnerControls", () => ({
    default: ({ itemId, urlLink }) => (
        <div data-testid="owner-controls">
            <div>{urlLink}</div>
            <div>{itemId}</div>
        </div>
    )
}));

const mockProps = {
    itemId: 5,
    urlLink: "testLink"
};

function setup(options = {
    isEditClicked: true
}) {
    render(
        <ActionsContext.Provider value={{ ...options }} >
            <OwnerButtons
                {...mockProps}
            />
        </ActionsContext.Provider >
    );
};

describe("OwnerButtons component", () => {
    it("renders EditControls and not OwnerControls when isEditClicked context is true", () => {
        setup();

        expect(screen.getByTestId("edit-controls")).toBeInTheDocument();
        expect(screen.getByText(mockProps.itemId)).toBeInTheDocument();

        expect(screen.queryByTestId("owner-controls")).not.toBeInTheDocument();
    });

    it("renders OwnerControls and not EditControls when isEditClicked context is false", () => {
        setup({
            isEditClicked: false,
        });

        expect(screen.getByTestId("owner-controls")).toBeInTheDocument();
        expect(screen.getByText(mockProps.itemId)).toBeInTheDocument();
        expect(screen.getByText(mockProps.urlLink)).toBeInTheDocument();

        expect(screen.queryByTestId("edit-controls")).not.toBeInTheDocument();
    });
});