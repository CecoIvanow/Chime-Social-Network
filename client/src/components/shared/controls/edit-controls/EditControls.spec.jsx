import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ActionsContext } from "../../../../contexts/actions-context";
import EditControls from "./EditControls";

vi.mock('../../../ui/buttons/link-button/LinkButton', () => ({
    default: ({ urlLink }) => (
        <div data-testid="edit-link-button">
            <span>{urlLink}</span>
        </div>
    )
}));

vi.mock('../../../ui/buttons/button/Button', () => ({
    default: ({ buttonName, onClickHandler }) => (
        <div
            data-testid={buttonName === 'Edit' ? 'edit-button' : 'cancel-button'}
            onClick={onClickHandler}
        >
            {buttonName}
        </div >
    )
}));

const mockProps = {
    urlLink: "Test Link",
    itemId: 5,
}

const mockedFunctions = {
    onCancelEditClickHandler: vi.fn(),
    onSaveEditClickHandler: vi.fn(),
}

describe('EditControls component', () => {
    it('renders Cancel Button component always, regardless of props', () => {
        const { rerender } = render(
            <ActionsContext.Provider value={{ ...mockedFunctions }}>
                <EditControls
                    urlLink={mockProps.urlLink}
                    itemId={mockProps.itemId}
                />
            </ActionsContext.Provider>
        );

        expect(screen.getByTestId('cancel-button')).toBeInTheDocument();

        rerender(
            <ActionsContext.Provider value={{ ...mockedFunctions }}>
                <EditControls />
            </ActionsContext.Provider>
        );

        expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    });

    it('renders Edit LinkButton when urlLink is provided', () => {
        render(
            <ActionsContext.Provider value={{ ...mockedFunctions }}>
                <EditControls
                    urlLink={mockProps.urlLink}
                />
            </ActionsContext.Provider>
        );

        expect(screen.getByTestId('edit-link-button')).toBeInTheDocument();
        expect(screen.getByText(mockProps.urlLink)).toBeInTheDocument();

        expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    });

    it('renders Edit Button when urlLink is not provided', () => {
        render(
            <ActionsContext.Provider value={{ ...mockedFunctions }}>
                <EditControls
                    itemId={mockProps.itemId}
                />
            </ActionsContext.Provider>
        );

        expect(screen.getByTestId('edit-button')).toBeInTheDocument();

        expect(screen.queryByTestId('edit-link-button')).not.toBeInTheDocument();
    });

    it('Cancel and Edit Buttons react on clicks', () => {
        render(
            <ActionsContext.Provider value={{ ...mockedFunctions }}>
                <EditControls
                    itemId={mockProps.itemId}
                />
            </ActionsContext.Provider>
        );

        fireEvent.click(screen.getByTestId('cancel-button'));
        expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
        expect(mockedFunctions.onCancelEditClickHandler).toBeCalledTimes(1);

        fireEvent.click(screen.getByTestId('edit-button'));
        expect(screen.getByTestId('edit-button')).toBeInTheDocument();
        expect(mockedFunctions.onSaveEditClickHandler).toBeCalledTimes(1);
        expect(mockedFunctions.onSaveEditClickHandler).toHaveBeenCalledWith(mockProps.itemId);
    });
});