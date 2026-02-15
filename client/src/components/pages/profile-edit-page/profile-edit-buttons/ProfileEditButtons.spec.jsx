import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ProfileEditButtons from "./ProfileEditButtons";

vi.mock("../../../shared/controls/edit-controls/EditControls", () => ({
    default: () => <div data-testid="edit-button"></div>
}));

beforeEach(() => {
    render(
        <ProfileEditButtons />
    );
});

describe("ProfileEditButtons component", () => {
    it("renders edit controls", () => {
        expect(screen.getByTestId("edit-button")).toBeInTheDocument();
    });
});