import { Link, MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { UserContext } from "../../../../../../../contexts/user-context.js";

import EditProfileButton from "./EditProfileButton.jsx";

vi.mock("../../../../../../ui/buttons/link-button/LinkButton", () => ({
    default: ({ urlLink, buttonName }) => <Link to={urlLink}>{buttonName}</Link>
}));

const isUser = "User123";

beforeEach(() => {
    render(
        <MemoryRouter>
            <UserContext.Provider value={{ isUser, }}>
                <EditProfileButton />
            </UserContext.Provider>
        </MemoryRouter>
    );
});

describe("EditProfileButton component", () => {
    it("renders link button with correct text value and src attributes", () => {
        expect(screen.getByRole("link", { value: "Edit Profile" })).toHaveAttribute("href", `/profile/${isUser}/edit`);
    });
});