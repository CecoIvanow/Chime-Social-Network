import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ErrorIcon from "./ErrorIcon";

describe("ErrorIcon component", () => {
    it("renders component", () => {
        render(<ErrorIcon />);

        expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    });
});