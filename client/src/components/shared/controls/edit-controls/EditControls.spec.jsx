import { Link, MemoryRouter } from "react-router";

import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionsContext } from "../../../../contexts/actions-context";

import EditControls from "./EditControls";

vi.mock("../../../ui/buttons/link-button/LinkButton", () => ({
    default: ({ urlLink }) => <Link to={urlLink}></Link>
}));

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName, onClickHandler }) => (
        <button onClick={onClickHandler}>{buttonName}</button >
    )
}));

const mockProps = {
    urlLink: "/test-link",
    itemId: 5,
};

const mockHandlers = {
    onCancelEditClickHandler: vi.fn(),
    onSaveEditClickHandler: vi.fn(),
};

function setup(options = {
    passUrlLink: true,
}) {
    const urlLinkProp = options.passUrlLink ? mockProps.urlLink : null;

    render(
        <MemoryRouter>
            <ActionsContext.Provider value={{ ...mockHandlers }}>
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
        { name: "renders Close Button on passed urlLink prop", passUrlLink: true },
        { name: "renders Close Button on empty urlLink prop", passUrlLink: false },
    ])("$name", ({passUrlLink}) => {
        setup({
            passUrlLink,
        });

        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("calls onCancelEditClickHandler on Close Button click", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Close" }));
        expect(mockHandlers.onCancelEditClickHandler).toHaveBeenCalled();
    });

    it("renders Edit LinkButton  and not Edit Button when urlLink is provided", () => {
        setup();

        expect(screen.getByRole("link")).toHaveAttribute("href", mockProps.urlLink);
        expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    });

    it("renders Edit Button and not Edit LinkButton when urlLink is not provided", () => {
        setup({
            passUrlLink: false,
        });

        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("calls onSaveEditClickHandler on Edit Button click", async () => {
        const user = userEvent.setup();
        setup({
            passUrlLink: false,
        });

        await user.click(screen.getByRole("button", { name: "Edit" }));
        expect(mockHandlers.onSaveEditClickHandler).toHaveBeenCalledWith(mockProps.itemId);
    });
});