import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { UserContext } from "../../../../../../../contexts/user-context.js";

import EditProfileButton from "./EditProfileButton.jsx";

vi.mock("../../../../../../ui/buttons/link-button/LinkButton", () => ({
    default: ({urlLink}) => (
        <div data-testid="edit-profile-btn">
            <span data-testid="url">{urlLink}</span>
        </div>
    )
}));

const isUser = "User123";

beforeEach(() => {
    render(
        <UserContext.Provider value={{ isUser, }}>
            <EditProfileButton />
        </UserContext.Provider>
    );
});

describe("EditProfileButton component", () => {
    it("renders LinkButton with the correct props from context", () => {
        expect(screen.getByTestId("edit-profile-btn")).toBeInTheDocument();

        expect(screen.getByTestId("url")).toHaveTextContent("/profile/User123/edit");
    })
})