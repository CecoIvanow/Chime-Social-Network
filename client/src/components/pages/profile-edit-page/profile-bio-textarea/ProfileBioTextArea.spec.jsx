import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ProfileBioTextArea from "./ProfileBioTextArea";

vi.mock("../../../ui/inputs/textarea-input-field/TextAreaInput", () => ({
    default: ({ initialValue, fieldName, inputName }) => <>
        <label data-testid="label-el" htmlFor={inputName}>{fieldName}</label>
        <textarea
            data-testid="input-el"
            id={inputName}
            name={inputName}
            defaultValue={initialValue}
        />
    </>
}));

const userData = {
    bio: "Test text!"
};

beforeEach(() => {
    render(
        <ProfileBioTextArea userData={userData} />
    );
});

describe("ProfileBioTextArea component", () => {
    it("renders component with passed props", () => {
        const pattern = /^Bio$/;

        const labelEl = screen.getByTestId("label-el");
        const inputEl = screen.getByTestId("input-el");

        expect(labelEl).toHaveAttribute("for", "bio");
        expect(labelEl).toHaveTextContent(pattern);

        expect(inputEl).toHaveAttribute("id", "bio");
        expect(inputEl).toHaveAttribute("name", "bio");
        expect(inputEl).toHaveValue(userData.bio);
    });
});