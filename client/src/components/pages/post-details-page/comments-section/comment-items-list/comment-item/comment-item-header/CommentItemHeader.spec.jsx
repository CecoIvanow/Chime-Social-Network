import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import CommentItemHeader from "./CommentItemHeader";

const mockProps = {
    comment: {
        owner: {
            _id: "ownerId",
            imageUrl: "https://example.org/avatar.webp",
            firstName: "Petar",
            lastName: "Ivanov",
        },
        postedOn: "23.12.2025",
    },
};

function setup() {
    render(
        <MemoryRouter>
            <CommentItemHeader {...mockProps} />
        </MemoryRouter>
    );
};

describe("CommentItemHeader component", () => {
    beforeEach(() => {
        setup();
    });

    it("renders image with correct src and alt attributes", () => {
        expect(screen.getByAltText(`${mockProps.comment.owner.firstName} ${mockProps.comment.owner.lastName} avatar`)).toHaveAttribute("src", mockProps.comment.owner.imageUrl);
    });

    it("renders link with href attribute and owner name value", () => {
        expect(screen.getByRole("link")).toHaveTextContent(`${mockProps.comment.owner.firstName} ${mockProps.comment.owner.lastName}`);
        expect(screen.getByRole("link")).toHaveAttribute("href", `/profile/${mockProps.comment.owner._id}`);
    });

    it("renders with posted on date", () => {
        expect(screen.getByText(`Posted on ${mockProps.comment.postedOn}`)).toBeInTheDocument();
    });
});