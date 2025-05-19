import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ActionsContext } from "../../../../contexts/actions-context";
import OwnerControls from "./OwnerControls";

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
            data-testid={buttonName === 'Edit' ? 'edit-button' : 'delete-button'}
            onClick={onClickHandler}
        >
            {buttonName}
        </div >
    )
}));

const mockedParams = {
    urlLink: "Test Link",
    itemId: 5,
}

const mockedFunctions = {
    onDeleteClickHandler: vi.fn(),
    onEditClickHandler: vi.fn(),
}

describe('OwnerControls component', () => {
    it('renders Delete Button component always, regardless of props', () => {
        const { rerender } = render(
            <ActionsContext.Provider value={{ ...mockedFunctions }}>
                <OwnerControls
                    urlLink={mockedParams.urlLink}
                    itemId={mockedParams.itemId}
                />
            </ActionsContext.Provider>
        );

        expect(screen.getByTestId('delete-button')).toBeInTheDocument();

        rerender(
            <ActionsContext.Provider value={{ ...mockedFunctions }}>
                <OwnerControls />
            </ActionsContext.Provider>
        );

        expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    });

    it('renders Edit LinkButton when urlLink is provided', () => {
        render(
            <ActionsContext.Provider value={{ ...mockedFunctions }}>
                <OwnerControls
                    urlLink={mockedParams.urlLink}
                />
            </ActionsContext.Provider>
        );

        expect(screen.getByTestId('edit-link-button')).toBeInTheDocument();
        expect(screen.getByText(mockedParams.urlLink)).toBeInTheDocument();

        expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    });

    it('renders Edit Button when urlLink is not provided', () => {
        render(
            <ActionsContext.Provider value={{ ...mockedFunctions }}>
                <OwnerControls
                    itemId={mockedParams.itemId}
                />
            </ActionsContext.Provider>
        );

        expect(screen.getByTestId('edit-button')).toBeInTheDocument();

        expect(screen.queryByTestId('edit-link-button')).not.toBeInTheDocument();
    });

    it('Cancel and Edit Buttons react on clicks', () => {
        render(
            <ActionsContext.Provider value={{ ...mockedFunctions }}>
                <OwnerControls
                    itemId={mockedParams.itemId}
                />
            </ActionsContext.Provider>
        );

        fireEvent.click(screen.getByTestId('delete-button'));
        expect(screen.getByTestId('delete-button')).toBeInTheDocument();
        expect(mockedFunctions.onDeleteClickHandler).toBeCalledTimes(1);
        expect(mockedFunctions.onDeleteClickHandler).toHaveBeenCalledWith(mockedParams.itemId);

        fireEvent.click(screen.getByTestId('edit-button'));
        expect(screen.getByTestId('edit-button')).toBeInTheDocument();
        expect(mockedFunctions.onEditClickHandler).toBeCalledTimes(1);
    });
});