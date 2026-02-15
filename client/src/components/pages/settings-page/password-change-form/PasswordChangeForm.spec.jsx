import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import PasswordChangeForm from "./PasswordChangeForm";

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
                    name={field.inputName}
                    type={field.inputType}
                />
            </>
        )
    )
}));

vi.mock("../../../ui/buttons/button/Button", () => ({
    default: ({ buttonName }) => <button type="submit">{buttonName}</button>
}));

const mockProps = {
    onSubmitHandler: vi.fn(),
};

const passwordChangeSettingsFields = [
    { fieldName: `Current Email`, inputType: 'text', inputName: 'curEmail' },
    { fieldName: 'Current Password', inputType: 'password', inputName: 'curPass' },
    { fieldName: 'New Password', inputType: 'password', inputName: 'newPass' },
    { fieldName: 'Repeat New Password', inputType: 'password', inputName: 'rePass' },
];

beforeEach(() => {
    render(
        <PasswordChangeForm
            {...mockProps}
        />
    );
});

describe("PasswordChangeForm component", () => {
    it("renders change password button", () => {
        expect(screen.getByRole("button", { name: "Change Password" })).toBeInTheDocument();
    });

    it("renders section heading with correct content", () => {
        expect(screen.getByTestId("section-heading")).toHaveTextContent("Account Password - ******");
    });

    it("renders the correct amount of input fields with name and type attributes and properly connected", () => {
        for (let i = 0; i < passwordChangeSettingsFields.length; i++) {
            expect(screen.getByLabelText(passwordChangeSettingsFields[i].fieldName)).toHaveAttribute("name", passwordChangeSettingsFields[i].inputName);
            expect(screen.getByLabelText(passwordChangeSettingsFields[i].fieldName)).toHaveAttribute("type", passwordChangeSettingsFields[i].inputType);
        };
    });

    it("triggers an event when the user submits the form", async () => {
        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Change Password" }));
        expect(mockProps.onSubmitHandler).toHaveBeenCalled();
    });
});