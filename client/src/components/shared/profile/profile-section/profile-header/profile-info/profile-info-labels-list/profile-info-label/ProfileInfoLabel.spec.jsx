import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProfileInfoLabel from "./ProfileInfoLabel.jsx";

const MISSING_DATA = "N\\A";

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

        expect(screen.getByText(mockProps.label.labelText)).toBeInTheDocument();
        expect(screen.getByText(mockProps.userData.bio)).toBeInTheDocument();

        expect(screen.queryByText(MISSING_DATA)).not.toBeInTheDocument();
    });

    it("renders with N\\A if empty userData is passed", () => {
        setup({
            isUserDataUndefined: true,
        });

        expect(screen.getByText(mockProps.label.labelText)).toBeInTheDocument();
        expect(screen.queryByText(mockProps.userData.bio)).not.toBeInTheDocument();

        expect(screen.getByText(MISSING_DATA)).toBeInTheDocument();
    });
});