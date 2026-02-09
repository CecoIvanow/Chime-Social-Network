import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import UserItemDetails from "./UserItemDetails";

const user = {
    _id: "userId123",
    imageUrl: "https://image.com/test-image.png",
    firstName: "John",
    lastName: "Doe",
    memberSince: "15.01.2026",
    createdPosts: [
        { content: "First post" },
        { content: "Second post" },
    ],
};

beforeEach(() => render(
    <MemoryRouter>
        <UserItemDetails user={user} />
    </MemoryRouter>
))

describe("UserItemDetails component", () => {
    it("renders component with passed props", () => {
        expect(screen.getByRole("img")).toHaveAttribute("src", user.imageUrl);
        expect(screen.getByRole("img")).toHaveAttribute("alt", "User avatar");

        expect(screen.getByRole("link")).toHaveAttribute("href", `/profile/${user._id}`);
        expect(screen.getByRole("link")).toHaveTextContent(`${user.firstName} ${user.lastName}`);

        expect(screen.getByText(`Member since: ${user.memberSince}`)).toBeInTheDocument();
        expect(screen.getByText(`Posts: ${user.createdPosts.length}`)).toBeInTheDocument();
    });
});