import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProfileEditButtons from "./ProfileEditButtons";

vi.mock("../../../shared/controls/edit-controls/EditControls", () => ({
    default: () => <button data-testid="edit-button"></button>
}));

describe("ProfileEditButtons component", () => {
    it("renders component", () => {
        render(
            <ProfileEditButtons />
        )

        expect(screen.getByTestId("edit-button")).toBeInTheDocument();
    });
});