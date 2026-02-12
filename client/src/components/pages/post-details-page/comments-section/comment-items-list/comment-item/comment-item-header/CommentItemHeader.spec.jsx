import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import CommentItemHeader from "./CommentItemHeader";

const comment = {
    owner: {
        _id: "ownerId",
        imageUrl: "https://example.org/avatar.webp",
        firstName: "Petar",
        lastName: "Ivanov",
    },
    postedOn: "23.12.2025",
}

function setup() {
    render(
        <MemoryRouter>
            <CommentItemHeader comment={comment} />
        </MemoryRouter>
    );
}

describe("CommentItemHeader component", () => {
    beforeEach(() => {
        setup();
    });

    it("renders component with passed props", () => {
        expect(screen.getByAltText(`${comment.owner.firstName} ${comment.owner.lastName} avatar`)).toHaveAttribute("src", comment.owner.imageUrl);
        expect(screen.getByRole("link")).toHaveTextContent(`${comment.owner.firstName} ${comment.owner.lastName}`);
        expect(screen.getByRole("link")).toHaveAttribute("href", `/profile/${comment.owner._id}`);
        expect(screen.getByText(`Posted on ${ comment.postedOn }`)).toBeInTheDocument();
    });
});