import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ErrorIcon from "./ErrorIcon";

describe("ErrorIcon component", () => {
    it("renders component", () => {
        render(<ErrorIcon />);

        expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    });
});