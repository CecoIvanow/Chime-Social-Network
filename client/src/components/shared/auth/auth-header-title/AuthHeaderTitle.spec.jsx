import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import AuthHeaderTitle from "./AuthHeaderTitle";

beforeEach(() => {
    render(
        <AuthHeaderTitle
            title="Password"
        />
    )
});

describe("AuthHeaderTitle component", () => {
    it("renders on screen", () => {

        expect(screen.getByTestId("auth-header-title")).toBeInTheDocument();
    });

    it("renders with passed text content", () => {

        expect(screen.getByText("Password")).toHaveTextContent("Password");
    });
});