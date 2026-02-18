import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import HeaderMessage from "./HeaderMessage";

describe("HeaderMessage component", () => {
    it("renders component", () => {
        render(<HeaderMessage />);

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Oops, something went wrong.");
    });
});