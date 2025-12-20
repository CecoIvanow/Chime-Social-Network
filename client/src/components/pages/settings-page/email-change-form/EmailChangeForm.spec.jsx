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
                <label htmlFor={field.inputName} data-testid="label-el">{field.fieldName}</label>
                <input
                    key={field.inputName}
                    id={field.inputName}
                    name={field.fieldName}
                    type={field.inputType}
                    data-testid="input-el"
                />
            </>
        )
    )
}));

describe("EmailChangeForm component", () => {
    const userEmail = "example@email.com";
    
    const onSubmitHandlerMock = vi.fn();

    const emailChangeSettingsFields = [
        { fieldName: `Account Email`, inputType: 'text', inputName: 'curEmail' },
        { fieldName: 'New Email', inputType: 'text', inputName: 'newEmail' },
        { fieldName: 'Current Password', inputType: 'password', inputName: 'curPass' },
        { fieldName: 'Repeat Password', inputType: 'password', inputName: 'rePass' },
    ];

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

    it("renders InputFieldsList with passed props", () => {
        renderComp();

        const labels = screen.getAllByTestId("label-el");
        const inputs = screen.getAllByTestId('input-el');

        for (let i = 0; i < emailChangeSettingsFields.length; i++) {
            const pattern = new RegExp(`^${emailChangeSettingsFields[i].fieldName}$`);

            expect(labels[i]).toHaveTextContent(pattern);
            expect(labels[i]).toHaveAttribute("for", emailChangeSettingsFields[i].inputName);

            expect(inputs[i]).toHaveAttribute("id", emailChangeSettingsFields[i].inputName);
            expect(inputs[i]).toHaveAttribute("name", emailChangeSettingsFields[i].fieldName);
            expect(inputs[i]).toHaveAttribute("type", emailChangeSettingsFields[i].inputType);
        };
    });
});