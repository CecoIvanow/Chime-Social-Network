import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ProfileInfoLabel from "./ProfileInfoLabel.jsx";

const mockProps = {
    label: {
        labelText: 'Bio',
        labelKey: 'bio',
    },
    userData: {
        bio: 'Coder'
    },
};

describe("ProfileInfoLabel componen", () => {
    it("renders with correct props", () => {
        render(<ProfileInfoLabel userData={mockProps.userData} label={ mockProps.label } />);

        expect(screen.getByText('Bio')).toBeInTheDocument();
        expect(screen.getByText('Coder')).toBeInTheDocument();

        expect(screen.queryByText('N\\A')).not.toBeInTheDocument();

    })

    it("renders with N\\A if empty userData is passed", () => {
        render(<ProfileInfoLabel userData={undefined} label={mockProps.label} />);

        expect(screen.getByText('Bio')).toBeInTheDocument();
        expect(screen.queryByText('Coder')).not.toBeInTheDocument();

        expect(screen.getByText('N\\A')).toBeInTheDocument();
    })
})