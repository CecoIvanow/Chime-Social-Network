import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

describe("ProfileBioTextArea component", () => {
    const userData = {
        bio: "Text text!"
    }

    it("renders component with passed props", () => {
        const pattern = /^Bio$/;
        render(
            <ProfileBioTextArea userData={userData}/>
        );

        const labelEl = screen.getByTestId("label-el");
        const inputEl = screen.getByTestId("input-el");

        expect(labelEl).toHaveAttribute("for", "bio");
        expect(labelEl).toHaveTextContent(pattern);

        expect(inputEl).toHaveAttribute("id", "bio");
        expect(inputEl).toHaveAttribute("name", "bio");
        expect(inputEl).toHaveValue(userData.bio);
    })
})