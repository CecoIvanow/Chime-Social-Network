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

beforeEach(() => render(
    <MemoryRouter>
        <UserItemDetails {...mockProps} />
    </MemoryRouter>
));

describe("UserItemDetails component", () => {
    it("renders component with correct member since date and posts amount", () => {
        expect(screen.getByText(`Member since: ${mockProps.user.memberSince}`)).toBeInTheDocument();
        expect(screen.getByText(`Posts: ${mockProps.user.createdPosts.length}`)).toBeInTheDocument();
    });

    it("renders component with correct src and alt image attributes", () => {
        expect(screen.getByRole("img")).toHaveAttribute("src", mockProps.user.imageUrl);
        expect(screen.getByRole("img")).toHaveAttribute("alt", "User avatar");
    });

    it("renders component with correct href and link text content attributes", () => {
        expect(screen.getByRole("img")).toHaveAttribute("src", mockProps.user.imageUrl);
        expect(screen.getByRole("img")).toHaveAttribute("alt", "User avatar");

        expect(screen.getByRole("link")).toHaveAttribute("href", `/profile/${mockProps.user._id}`);
        expect(screen.getByRole("link")).toHaveTextContent(`${mockProps.user.firstName} ${mockProps.user.lastName}`);
    });
});