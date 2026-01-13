import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import NotFoundMessage from "./NotFoundMessage";

const H1_CONTENT = "404";
const H2_CONTENT = "the page you requested could not be found";

describe("NotFoundMessage component", () => {
    it("NotFoundmessage component message is rendered", () => {
        render(
            <NotFoundMessage />
        );

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(H1_CONTENT);
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(H2_CONTENT);
    });
});