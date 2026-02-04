import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UserContext } from "../../../../../../../contexts/user-context.js";

import EditProfileButton from "./EditProfileButton.jsx";

vi.mock("../../../../../../ui/buttons/link-button/LinkButton", () => ({
    default: ({urlLink}) => (
        <div data-testid="edit-profile-btn">
            <span data-testid="url">{urlLink}</span>
        </div>
    )
}));

describe("EditProfileButton component", () => {
    it("renders LinkButton with the correct props from context", () => {
        render(
            <UserContext.Provider value={{ isUser: "User123" }}>
                <EditProfileButton />
            </UserContext.Provider>
        );

        expect(screen.getByTestId("edit-profile-btn")).toBeInTheDocument();

        expect(screen.getByTestId("url")).toHaveTextContent("/profile/User123/edit");
    })
})