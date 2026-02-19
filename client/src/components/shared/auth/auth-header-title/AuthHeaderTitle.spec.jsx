import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import AuthHeaderTitle from "./AuthHeaderTitle";

const mockProps = {
    title: "Password",
};

beforeEach(() => {
    render(
        <AuthHeaderTitle
            {...mockProps}
        />
    );
});

describe("AuthHeaderTitle component", () => {
    it("renders with the correct text value", () => {
        expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    });
});