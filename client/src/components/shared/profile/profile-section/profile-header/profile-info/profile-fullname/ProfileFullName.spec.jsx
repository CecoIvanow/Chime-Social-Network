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
    it("renders with passed props", () => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
});