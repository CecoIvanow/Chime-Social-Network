import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PasswordChangeForm from "./PasswordChangeForm";

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

describe("PasswordChangeForm component", () => {
    const onSubmitHandlerMock = vi.fn();

    const passwordChangeSettingsFields = [
        { fieldName: `Current Email`, inputType: 'text', inputName: 'curEmail' },
        { fieldName: 'Current Password', inputType: 'password', inputName: 'curPass' },
        { fieldName: 'New Password', inputType: 'password', inputName: 'newPass' },
        { fieldName: 'Repeat New Password', inputType: 'password', inputName: 'rePass' },
    ];

    function renderComp() {
        render(
            <PasswordChangeForm
                onSubmitHandler={onSubmitHandlerMock}
            />
        );
    }

    it("renders Button component with hardcoded values", () => {
        const pattern = new RegExp("^Change Password$");

        renderComp();
        expect(screen.getByTestId("button")).toHaveTextContent(pattern);
    });


});