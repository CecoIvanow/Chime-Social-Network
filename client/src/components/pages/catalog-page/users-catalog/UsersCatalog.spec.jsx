import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import UsersCatalog from "./UsersCatalog";

vi.mock("../../../ui/headings/SectionHeading", () => ({
    default: ({ sectionName }) => <p data-testid="section-heading">{sectionName}</p>
}));

vi.mock("../../../ui/search-field/SearchField", () => ({
    default: ({ searchBy, setSearchParams }) => <>
        <label data-testid="search-field-label">{searchBy}</label>
        <input
            data-testid="search-field-input"
            type="text"
            onChange={(e) => setSearchParams(e.currentTarget.value)}
        />
    </>
}));

vi.mock("./users-list/UsersList", () => ({
    default: ({ matchingUsers }) => <div data-testid="users-list">
        {matchingUsers.map(user => (
            <div key={user._id} data-testid="user">{user.firstName} {user.lastName}</div>
        ))}
    </div>
}));

vi.mock("../../../ui/loading-spinner/LoadingSpinner", () => ({
    default: () => <div data-testid="loading-spinner"></div>
}));

const totalUsers = [
    { firstName: "John", lastName: "Doe", _id: "userOne" },
    { firstName: "Ivan", lastName: "Petrov", _id: "userTwo" },
];

function setup(options = {
    isLoading: true
}) {
    render(
        <UsersCatalog
            isLoading={options.isLoading}
            totalUsers={totalUsers}
        />
    );
};

describe("UsersCatalog component", () => {
    it("renders component with passed props", () => {
        setup();

        expect(screen.getByTestId("section-heading")).toHaveTextContent("Registered Users:");

        expect(screen.getByTestId("search-field-label")).toHaveTextContent("name");
        expect(screen.getByTestId("search-field-input")).toBeInTheDocument();
    });

    it.each([
        { name: "renders LoadingSpinner on isLoading true", isLoading: true },
        { name: "renders UsersList on isLoading false", isLoading: false },
    ])("$name", ({ isLoading }) => {
        setup({
            isLoading,
        });

        if(isLoading) {
            expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
            expect(screen.queryByTestId("users-list")).not.toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
            expect(screen.getByTestId("users-list")).toBeInTheDocument();
        }
    })
});