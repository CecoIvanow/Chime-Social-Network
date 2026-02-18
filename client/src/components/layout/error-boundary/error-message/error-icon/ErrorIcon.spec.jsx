import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import ErrorIcon from "./ErrorIcon";

beforeEach(() => {
    render(<ErrorIcon />);
});

describe("ErrorIcon component", () => {
    it("renders component", () => {
        expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    });
});