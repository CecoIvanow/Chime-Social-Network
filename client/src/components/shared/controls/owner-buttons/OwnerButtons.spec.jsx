import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import OwnerButtons from "./OwnerButtons";

import { ActionsContext } from "../../../../contexts/actions-context";

vi.mock("../edit-controls/EditControls", () => ({
    default: ({ itemId }) => (
        <div data-testid="edit-controls">
            <span>{itemId}</span>
        </div>
    )
}));

vi.mock("../owner-controls/OwnerControls", () => ({
    default: ({ itemId, urlLink }) => (
        <div data-testid="owner-controls">
            <span>{urlLink}</span>
            <span>{itemId}</span>
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

describe('OwnerButtons component', () => {
    it('renders only EditControls component with isEditClicked context true', () => {
        setup();

        expect(screen.getByTestId('edit-controls')).toBeInTheDocument();
        expect(screen.getByText(String(mockProps.itemId))).toBeInTheDocument();

        expect(screen.queryByTestId('owner-controls')).not.toBeInTheDocument();
    });

    it('renders only OwnerControls component with isEditClicked context false', () => {
        setup({
            isEditClicked: false,
        });

        expect(screen.getByTestId('owner-controls')).toBeInTheDocument();
        expect(screen.getByText(String(mockProps.itemId))).toBeInTheDocument();
        expect(screen.getByText(mockProps.urlLink)).toBeInTheDocument();

        expect(screen.queryByTestId('edit-controls')).not.toBeInTheDocument();
    });
});