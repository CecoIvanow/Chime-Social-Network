import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ImageUpload from "./ImageUpload";

describe("ImageUpload component", () => {
    const imageUrlMock = "https://firebase.mock/avatar.webp";
    const setImageUploadMock = vi.fn();

    function renderComp() {
        render(
            <ImageUpload
                imageUrl={imageUrlMock}
                setImageUpload={setImageUploadMock}
            />
        );
    }

    it("renders ImageUpload with passed props", () => {
        renderComp();

        expect(screen.getByAltText("Profile picture")).toHaveAttribute("src", imageUrlMock);
    })
})