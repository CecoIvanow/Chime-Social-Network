import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthButton from "./AuthButton";

const mockProps = {
    buttonText: "Login",
};

function setup(options = {
    isPending: false,
}) {
    const isPendingState = options.isPending ? options.isPending : null;

    render(
        <AuthButton {...mockProps} isPending={isPendingState} />
    );
};

describe("AuthButton component", () => {
    it("renders button with text label", () => {
        setup();

        expect(screen.getByRole("button")).toHaveValue(mockProps.buttonText);
    });

    it.each([
        { name: "button is not disabled after data has loaded", isPending: false },
        { name: "button is disabled while data is loading", isPending: true },
    ])("$name", ({ isPending }) => {
        setup({
            isPending,
        });

        if (isPending) {
            expect(screen.getByRole("button")).toBeDisabled();
        } else {
            expect(screen.getByRole("button")).toBeEnabled();
        };
    });
});