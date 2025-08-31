import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProfileFullname from "./ProfileFullname.jsx";

const userData = {
    firstName: "John",
    lastName: "Doe",
}

describe("ProfileFullName component", () => {
    it("renders with passed props", () => {
        render(<ProfileFullname userData={userData} />);

        expect(screen.getByText("John Doe")).toBeInTheDocument();
    })
})