import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import ProfileFullname from "./ProfileFullname.jsx";

const mockProps = {
    userData: {
        firstName: "John",
        lastName: "Doe",
    }
};

beforeEach(() => {
    render(
        <ProfileFullname {...mockProps} />
    );
});

describe("ProfileFullName component", () => {
    it("renders heading with correct text content", () => {
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(`${mockProps.userData.firstName} ${mockProps.userData.lastName}`);
    });
});