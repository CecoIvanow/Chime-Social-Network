import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { AlertContext } from "../../../contexts/alert-context";

import CatalogPage from "./CatalogPage";

vi.mock("../../../hooks/usePostServices", () => ({
    default: () => ({
        getAllPosts: usePostMocks.getAllPosts,
        isLoading: usePostMocks.isLoading,
        abortAll: usePostMocks.abortAll,
    })
}));

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({
        getAllUsers: useUserMocks.getAllUsers,
        isLoading: useUserMocks.isLoading,
        abortAll: useUserMocks.abortAll,
    })
}));

vi.mock("./posts-catalog/PostsCatalog", () => ({
    default: ({ setTotalPosts, totalPosts, isLoading }) => (
        !isLoading && (
            <div data-testid="posts-catalog">
                {totalPosts.map(post => <div key={post._id} data-testid="post">{post.content}</div>)}
            </div>
        )
    )
}));

vi.mock("./users-catalog/UsersCatalog", () => ({
    default: ({ totalUsers, isLoading }) => (
        !isLoading && (
            <div data-testid="users-catalog">
                {totalUsers.map(user => <div key={user._id} data-testid="user">{user.fullName}</div>)}
            </div>
        )
    )
}));

const ERR_MSG = {
    GET_ALL_USERS: "Successfully rejected getAllUsers call",
    GET_ALL_POSTS: "Successfully rejected getAllPosts call",
}

const totalPosts = [
    { _id: 1, content: "First post!" },
    { _id: 2, content: "Sewcond post!" },
];

const totalUsers = [
    { _id: 1, fullName: "John Doe" },
    { _id: 2, fullName: "Willam Dafoe" },
];

const usePostMocks = {
    getAllPosts: vi.fn(),
    isLoading: false,
    abortAll: vi.fn(),
};

const useUserMocks = {
    getAllUsers: vi.fn(),
    isLoading: false,
    abortAll: vi.fn(),
};

const setAlert = vi.fn();

function setup(options = {
    getAllUsersSuccess: true,
    getAllPostsSuccess: true,
}) {
    options.getAllPostsSuccess ?
        usePostMocks.getAllPosts.mockResolvedValue(totalPosts) :
        usePostMocks.getAllPosts.mockRejectedValue(new Error(ERR_MSG.GET_ALL_POSTS));

    options.getAllUsersSuccess ?
        useUserMocks.getAllUsers.mockResolvedValue(totalUsers) :
        useUserMocks.getAllUsers.mockRejectedValue(new Error(ERR_MSG.GET_ALL_USERS));

    render(
        <AlertContext.Provider value={{ setAlert }}>
            <CatalogPage />
        </AlertContext.Provider>
    );
}

describe("CatalogPage component", () => {
    it("renders component with passed props", async () => {
        setup();

        await waitFor(() => {
            expect(screen.getByTestId("posts-catalog")).toBeInTheDocument();
            expect(screen.getByTestId("users-catalog")).toBeInTheDocument();
        });

        const posts = screen.getAllByTestId("post");
        const users = screen.getAllByTestId("user");

        expect(posts).toHaveLength(totalPosts.length);
        expect(users).toHaveLength(totalUsers.length);
    });
});