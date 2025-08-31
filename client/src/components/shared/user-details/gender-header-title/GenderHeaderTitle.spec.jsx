import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GenderHeaderTitle from "./GenderHeaderTitle.jsx";

describe("GenderHeaderTitle component", () => {
    it('renders on screen', () => {
        render(<GenderHeaderTitle/>);

        expect(screen.getByText('Gender')).toBeInTheDocument();
    })
})