import { Link, MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../contexts/actions-context";

import EditControls from "./EditControls";

vi.mock("../../../ui/buttons/link-button/LinkButton", () => ({
    default: ({ urlLink }) => <Link>{urlLink}</Link>
}));

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName, onClickHandler }) => (
        <button onClick={onClickHandler}>{buttonName}</button >
    )
}));

const mockProps = {
    urlLink: "Test Link",
    itemId: 5,
};

const mockedFunctions = {
    onCancelEditClickHandler: vi.fn(),
    onSaveEditClickHandler: vi.fn(),
};

function setup(options = {
    passUrlLink: true,
}) {
    const urlLinkProp = options.passUrlLink ? mockProps.urlLink : null;

    render(
        <MemoryRouter>
            <ActionsContext.Provider value={{ ...mockedFunctions }}>
                <EditControls
                    urlLink={urlLinkProp}
                    itemId={mockProps.itemId}
                />
            </ActionsContext.Provider>
        </MemoryRouter>
    );
};

describe("EditControls component", () => {
    it.each([
        { name: "renders cancel button on passed urlLink prop", passUrlLink: true },
        { name: "renders cancel button on empty urlLink prop", passUrlLink: false },
    ])("$name", ({passUrlLink}) => {
        setup({
            passUrlLink,
        });

        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("calls onCancelEditClickHandler on cancel button click event", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Close" }));
        expect(mockedFunctions.onCancelEditClickHandler).toHaveBeenCalled();
    });

    it("renders Edit LinkButton when urlLink is provided", () => {
        setup();

        expect(screen.getByRole("link")).toBeInTheDocument();
        expect(screen.getByText(mockProps.urlLink)).toBeInTheDocument();

        expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    });

    it("renders Edit Button when urlLink is not provided", () => {
        setup({
            passUrlLink: false,
        });

        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();

        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("Cancel and Edit Buttons react on clicks", async () => {
        const user = userEvent.setup();
        setup({
            passUrlLink: false,
        });

        await user.click(screen.getByRole("button", { name: "Edit" }));
        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
        expect(mockedFunctions.onSaveEditClickHandler).toBeCalledTimes(1);
        expect(mockedFunctions.onSaveEditClickHandler).toHaveBeenCalledWith(mockProps.itemId);
    });
});