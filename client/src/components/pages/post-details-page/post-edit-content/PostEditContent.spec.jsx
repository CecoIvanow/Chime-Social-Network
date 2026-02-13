import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import PostEditContent from "./PostEditContent";
import userEvent from "@testing-library/user-event";

const textChangeHandlerMock = vi.fn();

const PLACEHOLDER_TEXT = "Edit your post content...";
const POST_TEXT = "Hi, this is my first post!";

let textAreaEl;

beforeEach(() => {
    render(
        <PostEditContent
            postText={POST_TEXT}
            textChangeHandler={textChangeHandlerMock}
        />
    );
    textAreaEl = screen.getByPlaceholderText(PLACEHOLDER_TEXT)
});

describe("PostEditContent", () => {
    it("renders component with passed props", () => {
        expect(textAreaEl).toHaveValue(POST_TEXT);
    });

    it("triggers textChangeHandler on input change", async () => {
        const user = userEvent.setup();

        await user.type(textAreaEl, "a");
        expect(textChangeHandlerMock).toHaveBeenCalled();
    });
});