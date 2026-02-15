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

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName }) => <button>{buttonName}</button>
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
    it("renders Button component with hardcoded values", () => {
        expect(screen.getByRole("button", { name: "Change Email"})).toBeInTheDocument();
    });

    it("renders SectionHeading component with hardcoded values", () => {
        expect(screen.getByTestId("section-heading")).toHaveTextContent(mockProps.userEmail);
    });

    it("renders InputFieldsList with passed props", () => {
        for (let i = 0; i < emailChangeSettingsFields.length; i++) {
            expect(screen.getByLabelText(emailChangeSettingsFields[i].fieldName)).toHaveAttribute("name", emailChangeSettingsFields[i].fieldName);
            expect(screen.getByLabelText(emailChangeSettingsFields[i].fieldName)).toHaveAttribute("type", emailChangeSettingsFields[i].inputType);
        };
    });

    it("on submit handler gets attached to EmailChangeForm", async () => {
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Change Email"}));
        expect(mockProps.onSubmitHandler).toHaveBeenCalledOnce();
    })
});