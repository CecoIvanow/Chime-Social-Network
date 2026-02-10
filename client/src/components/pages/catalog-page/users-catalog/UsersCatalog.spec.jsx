import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import UsersCatalog from "./UsersCatalog";
import userEvent from "@testing-library/user-event";

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
    it("renders section heading and search field", () => {
        setup();

        expect(screen.getByTestId("section-heading")).toHaveTextContent("Registered Users:");

        expect(screen.getByTestId("search-field-label")).toHaveTextContent("name");
        expect(screen.getByTestId("search-field-input")).toBeInTheDocument();
    });

    it.each([
        { name: "renders a loading spinner while user data is loading", isLoading: true },
        { name: "renders users when data has loaded", isLoading: false },
    ])("$name", ({ isLoading }) => {
        setup({
            isLoading,
        });

        if (isLoading) {
            expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
            expect(screen.queryByTestId("users-list")).not.toBeInTheDocument();
        } else {
            expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
            expect(screen.getByTestId("users-list")).toBeInTheDocument();
        };
    });

    it.each([
        { name: "matches the only 'John' user", searchBy: "John", expectedCount: 1 },
        { name: "matches the only 'Petrov' user", searchBy: "Petrov", expectedCount: 1 },
        { name: "matches all people with an empty search string", searchBy: "", expectedCount: totalUsers.length },
        { name: "matches everyone using search string 'e'", searchBy: "e", expectedCount: totalUsers.length },
        { name: "matches no one on when searching with 'William'", searchBy: "William", expectedCount: "0" },
    ])("$name", async ({ searchBy, expectedCount }) => {
        const user = userEvent.setup();
        setup({
            isLoading: false,
        });

        if (searchBy) {
            await user.type(screen.getByTestId("search-field-input"), searchBy);
        };

        if (expectedCount > 0) {
            expect(await screen.findAllByTestId("user")).toHaveLength(expectedCount);
        } else {
            expect(screen.queryAllByTestId("user")).toHaveLength(Number(expectedCount));
        };
    });
});