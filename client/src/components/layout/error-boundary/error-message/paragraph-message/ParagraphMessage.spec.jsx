import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ParagraphMessage from "./ParagraphMessage";

describe("ParagraphMessage component", () => {
    it("renders component", () => {
        render(<ParagraphMessage />);

        expect(screen.getByText("Please reload the page.")).toBeInTheDocument();
    });
});