import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PostEditContent from "./PostEditContent";

const PLACEHOLDER_TEXT = "Edit your post content...";

const postText = "Hi, this is my first post!";

const textChangeHandlerMock = vi.fn();

function setup() {
    render(
        <PostEditContent
            postText={postText}
            textChangeHandler={textChangeHandlerMock}
        />
    );
};

describe("PostEditContent", () => {
    it("renders component with passed props", () => {
        setup();

        expect(screen.getByPlaceholderText(PLACEHOLDER_TEXT)).toHaveValue(postText);
    });
});