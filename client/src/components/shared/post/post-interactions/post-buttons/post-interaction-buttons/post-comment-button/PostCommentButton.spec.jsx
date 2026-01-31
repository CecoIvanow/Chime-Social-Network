import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { PostContext } from "../../../../../../../contexts/post-context";

import PostCommentButton from "./PostCommentButton";

const post = {
    _id: 1
};

vi.mock("../../../../../../ui/buttons/link-button/LinkButton", () => ({
    default: ({ urlLink }) => (
        <div data-testid='urlLink'>{urlLink}</div>
    )
}));

beforeEach(() => {
    render(
        <PostContext.Provider value={{ post }}>
            <PostCommentButton />
        </PostContext.Provider >
    );
});

describe("PostCommentButton component", () => {
    it("renders LinkButton with correct urlLink prop", () => {
        expect(screen.getByTestId('urlLink')).toHaveTextContent(`/post/${post._id}/details`);
    });
});