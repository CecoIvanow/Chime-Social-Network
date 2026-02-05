import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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

function setup(options={
    isUserDataUndefined: false,
}) {
    const userData = options.isUserDataUndefined ? undefined : mockProps.userData;

    render(
        <ProfileInfoLabel userData={userData} label={mockProps.label} />
    );

};

describe("ProfileInfoLabel componen", () => {
    it("renders with correct props", () => {
        setup();

        expect(screen.getByText('Bio')).toBeInTheDocument();
        expect(screen.getByText('Coder')).toBeInTheDocument();

        expect(screen.queryByText('N\\A')).not.toBeInTheDocument();
    });

    it("renders with N\\A if empty userData is passed", () => {
        setup({
            isUserDataUndefined: true,
        });

        expect(screen.getByText('Bio')).toBeInTheDocument();
        expect(screen.queryByText('Coder')).not.toBeInTheDocument();

        expect(screen.getByText('N\\A')).toBeInTheDocument();
    });
});