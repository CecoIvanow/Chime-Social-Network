import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import GenderHeaderTitle from "./GenderHeaderTitle.jsx";

beforeEach(() => {
    render(<GenderHeaderTitle />);
});

describe("GenderHeaderTitle component", () => {
    it('renders on screen', () => {
        expect(screen.getByText('Gender')).toBeInTheDocument();
    });
});