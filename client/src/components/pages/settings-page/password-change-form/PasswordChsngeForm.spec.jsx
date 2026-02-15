import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import PasswordChangeForm from "./PasswordChangeForm";

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

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName }) => <button data-testid="button">{buttonName}</button>
}));

const onSubmitHandlerMock = vi.fn();

const passwordChangeSettingsFields = [
    { fieldName: `Current Email`, inputType: 'text', inputName: 'curEmail' },
    { fieldName: 'Current Password', inputType: 'password', inputName: 'curPass' },
    { fieldName: 'New Password', inputType: 'password', inputName: 'newPass' },
    { fieldName: 'Repeat New Password', inputType: 'password', inputName: 'rePass' },
];

beforeEach(() => {
    render(
        <PasswordChangeForm
            onSubmitHandler={onSubmitHandlerMock}
        />
    );
});

describe("PasswordChangeForm component", () => {
    it("renders Button component with hardcoded values", () => {
        const pattern = new RegExp("^Change Password$");

        expect(screen.getByTestId("button")).toHaveTextContent(pattern);
    });

    it("renders SectionHeading component with hardcoded values", () => {
        const pattern = /^Account Password - \*\*\*\*\*\*$/;

        expect(screen.getByTestId("section-heading")).toHaveTextContent(pattern);
    });

    it("renders InputFieldsList with passed props", () => {
        const labels = screen.getAllByTestId("label-el");
        const inputs = screen.getAllByTestId('input-el');

        for (let i = 0; i < passwordChangeSettingsFields.length; i++) {
            const pattern = new RegExp(`^${passwordChangeSettingsFields[i].fieldName}$`);

            expect(labels[i]).toHaveTextContent(pattern);
            expect(labels[i]).toHaveAttribute("for", passwordChangeSettingsFields[i].inputName);

            expect(inputs[i]).toHaveAttribute("id", passwordChangeSettingsFields[i].inputName);
            expect(inputs[i]).toHaveAttribute("name", passwordChangeSettingsFields[i].fieldName);
            expect(inputs[i]).toHaveAttribute("type", passwordChangeSettingsFields[i].inputType);
        };
    });

    it("on submit handler gets attached to PasswordChangeForm", () => {
        fireEvent.click(screen.getByTestId("button"));
        expect(onSubmitHandlerMock).toHaveBeenCalledOnce();
    });
});