import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeAll } from "vitest";

import ImageUpload from "./ImageUpload";

beforeAll(() => {
    const global = window;
    
    global.URL.createObjectURL = vi.fn(() => "blob:mock-image-url");
    global.URL.revokeObjectURL = vi.fn();
})

describe("ImageUpload component", () => {
    const imageUrlMock = "https://firebase.mock/avatar.webp";
    const setImageUploadMock = vi.fn();
    const imageFile = new File(
        ["bits"],
        "avatar.png",
        {type: "image/png"}
    );

    function renderComp() {
        render(
            <ImageUpload
                imageUrl={imageUrlMock}
                setImageUpload={setImageUploadMock}
            />
        );
    };

    it("renders ImageUpload with passed props", () => {
        renderComp();

        expect(screen.getByAltText("Profile picture")).toHaveAttribute("src", imageUrlMock);
    });

    it("uploads image and shows image preview", () => {
        renderComp();

        fireEvent.change(screen.getByTestId("image-input"), {target: {files: [imageFile]}});

        expect(setImageUploadMock).toHaveBeenCalledWith(imageFile);
        expect(screen.getByAltText("Profile picture")).toHaveAttribute("src", "blob:mock-image-url");
    });

    it("renders original image preview on empty upload", () => {
        renderComp();

        fireEvent.change(screen.getByTestId("image-input"), { target: { files: [] } });

        expect(setImageUploadMock).not.toHaveBeenCalled();
        expect(screen.getByAltText("Profile picture")).toHaveAttribute("src", imageUrlMock);
    })
});