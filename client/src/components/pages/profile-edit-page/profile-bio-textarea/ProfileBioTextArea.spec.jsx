import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ProfileBioTextArea from "./ProfileBioTextArea";

vi.mock("../../../ui/inputs/textarea-input-field/TextAreaInput", () => ({
    default: ({ initialValue, fieldName, inputName }) => <>
        <label data-testid="label-el" htmlFor={inputName}>{fieldName}</label>
        <textarea
            data-testid="input-el"
            id={inputName}
            defaultValue={initialValue}
        />
    </>
}));

const mockProps = {
    userData: {
        bio: "Test text!"
    },
};

beforeEach(() => {
    render(
        <ProfileBioTextArea {...mockProps} />
    );
});

describe("ProfileBioTextArea component", () => {
    it("renders with correct value attribute", () => {
        expect(screen.getByLabelText("Bio")).toHaveValue(mockProps.userData.bio);
    });
});