import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoadingSpinner from "./LoadingSpinner";

describe('LoadingSpinner component', () => {
    it('Should render a loading spinner', () => {
        render(<LoadingSpinner/>);
        
        const outerDiv = screen.getByTestId('loading-container');
        const innerDiv = screen.getByTestId('loading-spinner')

        expect(outerDiv).toBeInTheDocument();
        expect(innerDiv).toBeInTheDocument();
    })
})