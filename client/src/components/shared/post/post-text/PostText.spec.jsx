import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PostText from "./PostText";

describe('PostText component', () => {
    it('renders component with passed postText', () => {
        render(
            <PostText
                postText='Some text.'
            />
        )

        expect(screen.getByText('Some text.')).toBeInTheDocument();
    })
})