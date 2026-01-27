import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import SectionHeading from "./SectionHeading";

beforeEach(() => render(<SectionHeading sectionName={"Friends"} />))

describe("SectionHeading component", () => {
    it("Should render sectionName text", () => {
        expect(screen.getByRole("heading")).toHaveTextContent("Friends");
    });
});