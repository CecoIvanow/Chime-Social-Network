import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeAll, beforeEach } from "vitest";

import ImageUpload from "./ImageUpload";

const global = window;
const imageUrlMock = "https://firebase.mock/avatar.webp";
const setImageUploadMock = vi.fn();
const imageFile = new File(
    ["bits"],
    "avatar.png",
    { type: "image/png" }
);

beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => "blob:mock-image-url");
    global.URL.revokeObjectURL = vi.fn();
});

beforeEach(() => {
    render(
        <ImageUpload
            imageUrl={imageUrlMock}
            setImageUpload={setImageUploadMock}
        />
    );
});

describe("ImageUpload component", () => {
    it("renders ImageUpload with passed props", () => {
        expect(screen.getByAltText("Profile picture")).toHaveAttribute("src", imageUrlMock);
    });

    it("uploads image and shows image preview", () => {
        fireEvent.change(screen.getByTestId("image-input"), { target: { files: [imageFile] } });

        expect(setImageUploadMock).toHaveBeenCalledWith(imageFile);
        expect(screen.getByAltText("Profile picture")).toHaveAttribute("src", "blob:mock-image-url");
    });

    it("renders original image preview on empty upload", () => {
        fireEvent.change(screen.getByTestId("image-input"), { target: { files: [] } });

        expect(setImageUploadMock).not.toHaveBeenCalled();
        expect(screen.getByAltText("Profile picture")).toHaveAttribute("src", imageUrlMock);
    });

    it("revokes previous image on new upload", () => {
        fireEvent.change(screen.getByTestId("image-input"), { target: { files: [imageFile] } });
        fireEvent.change(screen.getByTestId("image-input"), { target: { files: [imageFile] } });

        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    })
});