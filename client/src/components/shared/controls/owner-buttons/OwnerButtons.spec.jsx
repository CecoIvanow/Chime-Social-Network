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
}))

vi.mock("../owner-controls/OwnerControls", () => ({
    default: ({ itemId, urlLink }) => (
        <div data-testid="owner-controls">
            <span>{urlLink}</span>
            <span>{itemId}</span>
        </div>
    )
}))

const mockedProps = {
    itemId: 5,
    urlLink: "testLink"
}

describe('OwnerButtons component', () => {
    it('renders only EditControls component with isEditClicked context true', () => {
        render(
            <ActionsContext.Provider value={{ isEditClicked: true }} >
                <OwnerButtons
                    {...mockedProps}
                />
            </ActionsContext.Provider >
        )

        expect(screen.getByTestId('edit-controls')).toBeInTheDocument();
        expect(screen.getByText(String(mockedProps.itemId))).toBeInTheDocument();

        expect(screen.queryByTestId('owner-controls')).not.toBeInTheDocument();
    });

    it('renders only OwnerControls component with isEditClicked context false', () => {
        render(
            <ActionsContext.Provider value={{ isEditClicked: false }} >
                <OwnerButtons
                    {...mockedProps}
                />
            </ActionsContext.Provider >
        )

        expect(screen.getByTestId('owner-controls')).toBeInTheDocument();
        expect(screen.getByText(String(mockedProps.itemId))).toBeInTheDocument();
        expect(screen.getByText(mockedProps.urlLink)).toBeInTheDocument();

        expect(screen.queryByTestId('edit-controls')).not.toBeInTheDocument();
    });
})