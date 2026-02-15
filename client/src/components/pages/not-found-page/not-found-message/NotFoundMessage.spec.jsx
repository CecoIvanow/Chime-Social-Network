import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import NotFoundMessage from "./NotFoundMessage";

const H1_CONTENT = "404";
const H2_CONTENT = "the page you requested could not be found";

beforeEach(() => {
    render(
        <NotFoundMessage />
    );
});

describe("NotFoundMessage component", () => {
    it("renders component with error/not-found message", () => {
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(H1_CONTENT);
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(H2_CONTENT);
    });
});