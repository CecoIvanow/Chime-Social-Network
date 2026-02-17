import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import UserItemDetails from "./UserItemDetails";

const mockProps = {
    user: {
        _id: "userId123",
        imageUrl: "https://image.com/test-image.png",
        firstName: "John",
        lastName: "Doe",
        memberSince: "15.01.2026",
        createdPosts: [
            { content: "First post" },
            { content: "Second post" },
        ],
    },
};

beforeEach(() => {
    render(
        <MemoryRouter>
            <UserItemDetails {...mockProps} />
        </MemoryRouter>
    );
});

describe("UserItemDetails component", () => {
    it("renders user details with correct member since date and posts count", () => {
        expect(screen.getByText(`Member since: ${mockProps.user.memberSince}`)).toBeInTheDocument();
        expect(screen.getByText(`Posts: ${mockProps.user.createdPosts.length}`)).toBeInTheDocument();
    });

    it("renders image with correct src and alt attributes", () => {
        expect(screen.getByRole("img")).toHaveAttribute("src", mockProps.user.imageUrl);
        expect(screen.getByRole("img")).toHaveAttribute("alt", "User avatar");
    });

    it("renders user's name as link with correct href attribute", () => {
        expect(screen.getByRole("link")).toHaveAttribute("href", `/profile/${mockProps.user._id}`);
        expect(screen.getByRole("link")).toHaveTextContent(`${mockProps.user.firstName} ${mockProps.user.lastName}`);
    });
});