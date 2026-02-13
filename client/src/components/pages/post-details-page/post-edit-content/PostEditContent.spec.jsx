import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import PostEditContent from "./PostEditContent";

const textChangeHandlerMock = vi.fn();

const PLACEHOLDER_TEXT = "Edit your post content...";
const POST_TEXT = "Hi, this is my first post!";

beforeEach(() => {
    render(
        <PostEditContent
            postText={POST_TEXT}
            textChangeHandler={textChangeHandlerMock}
        />
    );
});

describe("PostEditContent", () => {
    it("renders textarea with correct value and placeholder attributes", () => {
        expect(screen.getByRole("textbox", {value: POST_TEXT})).toHaveAttribute("placeholder", PLACEHOLDER_TEXT);
    });

    it("triggers an event on user typing", async () => {
        const user = userEvent.setup();

        await user.type(screen.getByRole("textbox", { value: POST_TEXT }), "a");
        expect(textChangeHandlerMock).toHaveBeenCalled();
    });
});