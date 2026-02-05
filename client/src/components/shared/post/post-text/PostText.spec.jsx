import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";

import PostText from "./PostText";

const text = "Some text.";

beforeEach(() => {
    render(
        <PostText
            postText={text}
        />
    )
});

describe("PostText component", () => {
    it("renders component with passed postText", () => {
        expect(screen.getByText(text)).toBeInTheDocument();
    });
});