import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import ParagraphMessage from "./ParagraphMessage";

beforeEach(() => {
    render(
        <ParagraphMessage />
    );
});

describe("ParagraphMessage component", () => {
    it("renders component", () => {
        expect(screen.getByText("Please reload the page.")).toBeInTheDocument();
    });
});