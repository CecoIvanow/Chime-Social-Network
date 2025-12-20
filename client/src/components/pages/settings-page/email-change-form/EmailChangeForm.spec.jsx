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
    const userEmail = "example@email.com";
    const onSubmitHandlerMock = vi.fn();

    function renderComp() {
        render(
            <EmailChangeForm
                userEmail={userEmail}
                onSubmitHandler={onSubmitHandlerMock}
            />
        );
    }

    it("renders Button component with hardcoded values", () => {
        const pattern = new RegExp("^Change Email$");

        renderComp();
        expect(screen.getByTestId("button")).toHaveTextContent(pattern);
    });

    it("renders SectionHeading component with hardcoded values", () => {
        const pattern = new RegExp(`^Account Email - ${userEmail}$`);


        renderComp();
        expect(screen.getByTestId("section-heading")).toHaveTextContent(pattern);
    });
});