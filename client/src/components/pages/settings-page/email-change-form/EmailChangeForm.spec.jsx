import React from "react";

import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import EmailChangeForm from "./EmailChangeForm";

vi.mock("../../../ui/headings/SectionHeading", () => ({
    default: ({ sectionName }) => <div data-testid="section-heading">{sectionName}</div>
}));

vi.mock("../../../shared/input-fields/input-fields-list/InputFieldsList", () => ({
    default: ({ inputFields }) => (
        inputFields.map(field =>
            <React.Fragment key={field.inputName}>
                <label htmlFor={field.inputName}>{field.fieldName}</label>
                <input
                    key={field.inputName}
                    id={field.inputName}
                    name={field.fieldName}
                    type={field.inputType}
                />
            </React.Fragment>
        )
    )
}));

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName }) => <button type="submit">{buttonName}</button>
}));

const mockProps = {
    userEmail: "example@email.com",
    onSubmitHandler: vi.fn(),
};

const emailChangeSettingsFields = [
    { fieldName: `Account Email`, inputType: 'text', inputName: 'curEmail' },
    { fieldName: 'New Email', inputType: 'text', inputName: 'newEmail' },
    { fieldName: 'Current Password', inputType: 'password', inputName: 'curPass' },
    { fieldName: 'Repeat Password', inputType: 'password', inputName: 'rePass' },
];

beforeEach(() => {
    render(
        <EmailChangeForm
            {...mockProps}
        />
    );
});

describe("EmailChangeForm component", () => {
    it("renders section heading with the user email in it", () => {
        expect(screen.getByTestId("section-heading")).toHaveTextContent(mockProps.userEmail);
    });

    it("renders the change email button", () => {
        expect(screen.getByRole("button", { name: "Change Email"})).toBeInTheDocument();
    });

    it("renders the correct amount of input fields with name and type attributes and properly connected ", () => {
        for (let i = 0; i < emailChangeSettingsFields.length; i++) {
            expect(screen.getByLabelText(emailChangeSettingsFields[i].fieldName)).toHaveAttribute("name", emailChangeSettingsFields[i].fieldName);
            expect(screen.getByLabelText(emailChangeSettingsFields[i].fieldName)).toHaveAttribute("type", emailChangeSettingsFields[i].inputType);
        };
    });

    it("triggers an event on form submit", async () => {
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Change Email"}));
        expect(mockProps.onSubmitHandler).toHaveBeenCalledOnce();
    })
});