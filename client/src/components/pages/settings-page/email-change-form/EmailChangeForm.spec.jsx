import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import EmailChangeForm from "./EmailChangeForm";

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName }) => <button data-testid="button">{buttonName}</button>
}));

vi.mock("../../../ui/headings/SectionHeading", () => ({
    default: ({ sectionName }) => <div data-testid="section-heading">{sectionName}</div>
}));

vi.mock("../../../shared/input-fields/input-fields-list/InputFieldsList", () => ({
    default: ({ inputFields }) => (
        inputFields.map(field =>
            <>
                <label htmlFor={field.inputName}>{field.fieldName}</label>
                <input
                    key={field.inputName}
                    id={field.inputName}
                    name={field.fieldName}
                    type={field.inputType}
                />
            </>
        )
    )
}));

describe("EmailChangeForm component", () => {
    it("renders Button component with hardcoded values", () => {
        render(
            <EmailChangeForm />
        );

        expect(screen.getByTestId("button")).toHaveTextContent("Change Email");
    })
})