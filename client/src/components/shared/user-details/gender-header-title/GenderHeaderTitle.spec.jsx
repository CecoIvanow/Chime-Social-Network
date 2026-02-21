import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import GenderHeaderTitle from "./GenderHeaderTitle.jsx";

beforeEach(() => {
    render(
        <GenderHeaderTitle />
    );
});

describe("GenderHeaderTitle component", () => {
    it('renders the gender header title with correct text content', () => {
        expect(screen.getByText('Gender')).toBeInTheDocument();
    });
});