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

    it("isPending is false by default", () => {
        setup();

        expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("is disabled if isPending is true", () => {
        setup({
            isPending: true
        });

        expect(screen.getByRole("button")).toBeDisabled();
    });
});