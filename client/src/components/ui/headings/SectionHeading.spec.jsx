import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import SectionHeading from "./SectionHeading";

const headerLabel = "Friends";

beforeEach(() => render(<SectionHeading sectionName={headerLabel} />))

describe("SectionHeading component", () => {
    it("Should render sectionName text", () => {
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(headerLabel);
    });
});