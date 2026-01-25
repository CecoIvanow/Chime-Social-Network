import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthButton from "./AuthButton";

const buttonText = "Login";

function setup(options={
    isPending: false,
}) {
    render(
        <AuthButton buttonText={buttonText} isPending={options.isPending} />
    );
};

describe("AuthButton component", () => {
    it("renders a submit button with the correct text and container", () => {
        setup();

        expect(screen.getByRole("button")).toHaveValue(buttonText);
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
            expect(screen.getByRole("button")).not.toBeDisabled();
        };
    });
});