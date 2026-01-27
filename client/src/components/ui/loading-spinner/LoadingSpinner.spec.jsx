import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import LoadingSpinner from "./LoadingSpinner";

beforeEach(() => render(<LoadingSpinner />));

describe('LoadingSpinner component', () => {
    it('renders the loading spinner', () => {
        const outerDiv = screen.getByTestId('loading-container');
        const innerDiv = screen.getByTestId('loading-spinner')

        expect(outerDiv).toBeInTheDocument();
        expect(innerDiv).toBeInTheDocument();
    })
})