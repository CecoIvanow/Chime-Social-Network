import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthButton from "./AuthButton";

const mockProps = {
    buttonText: "Login",
};

function setup(options={
    isPending: false,
}) {
    const isPendingState = options.isPending ? options.isPending : null;

    render(
        <AuthButton buttonText={mockProps.buttonText} isPending={isPendingState} />
    );
};

describe("AuthButton component", () => {
    it("renders button with text label", () => {
        setup();

        expect(screen.getByRole("button")).toHaveValue(mockProps.buttonText);
    });

    it("isPending defaults to false on missing prop", () => {
        setup();

        expect(screen.getByRole("button")).toBeEnabled();
    });

    it.each([
        {name: "button is not disabled on isPending false", isPending: false},
        {name: "button is disabled on isPending true", isPending: true},
    ])("$name", ({isPending}) => {
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