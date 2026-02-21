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
    it("renders Close button on mount", ({ passUrlLink }) => {
        setup({
            passUrlLink,
        });

        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("triggers an event on Close button click", async () => {
        const user = userEvent.setup();
        setup();

        await user.click(screen.getByRole("button", { name: "Close" }));
        expect(mockHandlers.onCancelEditClickHandler).toHaveBeenCalled();
    });

    it("renders Edit link button wit correct href attribute instead of normal button when a link is provided", () => {
        setup();

        expect(screen.getByRole("link", { value: "Edit" })).toHaveAttribute("href", mockProps.urlLink);
        expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
    });

    it("renders Edit button instead of link button when a link is not provided", () => {
        setup({
            passUrlLink: false,
        });

        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { value: "Edit" })).not.toBeInTheDocument();
    });

    it("triggers an event on Edit button click", async () => {
        const user = userEvent.setup();
        setup({
            passUrlLink: false,
        });

        await user.click(screen.getByRole("button", { name: "Edit" }));
        expect(mockHandlers.onSaveEditClickHandler).toHaveBeenCalledWith(mockProps.itemId);
    });
});