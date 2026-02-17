import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeAll, beforeEach } from "vitest";

import ImageUpload from "./ImageUpload";

const global = window;
const imageFile1 = new File(
    ["bits"],
    "avatar.png",
    { type: "image/png" }
);

const imageFile2 = new File(
    ["bits"],
    "avatar-two.png",
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
    it("renders ImageUpload with correct alt attribute and src attribute with initial image url", () => {
        expect(screen.getByRole("img")).toHaveAttribute("src", mockProps.imageUrl);
        expect(screen.getByRole("img")).toHaveAttribute("alt", "Profile picture");
    });

    it("uploads image and shows image preview", async () => {
        const user = userEvent.setup();

        await user.upload(screen.getByTestId("image-input"), imageFile1);

        expect(mockProps.setImageUpload).toHaveBeenCalledWith(imageFile1);
        expect(screen.getByRole("img")).toHaveAttribute("src", "blob:mock-image-url");
    });

    it("renders original image preview on empty upload", async () => {

        fireEvent.change(screen.getByTestId("image-input"), { target: { files: [] } });

        expect(mockProps.setImageUpload).not.toHaveBeenCalled();
        expect(screen.getByRole("img")).toHaveAttribute("src", mockProps.imageUrl);
    });

    it("revokes previous image on new upload", async () => {
        const user = userEvent.setup();

        await user.upload(screen.getByTestId("image-input"), imageFile1);
        await user.upload(screen.getByTestId("image-input"), imageFile2);

        expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    })
});