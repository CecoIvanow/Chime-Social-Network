import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeAll, beforeEach } from "vitest";

import ImageUpload from "./ImageUpload";

const global = window;
const imageFile = new File(
    ["bits"],
    "avatar.png",
    { type: "image/png" }
);

const mockProps = {
    imageUrl: "https://example.com/avatar.webp",
    setImageUpload: vi.fn(),
};

beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => "blob:mock-image-url");
    global.URL.revokeObjectURL = vi.fn();
});

beforeEach(() => {
    render(
        <ImageUpload
            {...mockProps}
        />
    );
});

describe("ImageUpload component", () => {
    it("renders ImageUpload with passed props", () => {
        expect(screen.getByAltText("Profile picture")).toHaveAttribute("src", mockProps.imageUrl);
    });

    it("uploads image and shows image preview", () => {
        fireEvent.change(screen.getByTestId("image-input"), { target: { files: [imageFile] } });

        expect(mockProps.setImageUpload).toHaveBeenCalledWith(imageFile);
        expect(screen.getByAltText("Profile picture")).toHaveAttribute("src", "blob:mock-image-url");
    });

    it("renders original image preview on empty upload", () => {
        fireEvent.change(screen.getByTestId("image-input"), { target: { files: [] } });

        expect(mockProps.setImageUpload).not.toHaveBeenCalled();
        expect(screen.getByAltText("Profile picture")).toHaveAttribute("src", mockProps.imageUrl);
    });

    it("revokes previous image on new upload", () => {
        fireEvent.change(screen.getByTestId("image-input"), { target: { files: [imageFile] } });
        fireEvent.change(screen.getByTestId("image-input"), { target: { files: [imageFile] } });

        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    })
});