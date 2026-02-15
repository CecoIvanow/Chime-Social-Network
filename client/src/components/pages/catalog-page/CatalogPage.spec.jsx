import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../contexts/alert-context";

import CatalogPage from "./CatalogPage";

vi.mock("../../../hooks/usePostServices", () => ({
    default: () => ({
        ...usePostServicesMock
    })
}));

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({
        ...useUserServices
    })
}));

vi.mock("./posts-catalog/PostsCatalog", () => ({
    default: ({ setTotalPosts, totalPosts, isLoading }) => (
        !isLoading && (
            <div data-testid="posts-catalog" onClick={() => setTotalPosts([totalPosts[0]])}>
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

const UPDATED_POSTS_AMOUNT = 1;

const ERR_MSG = {
    GET_ALL_USERS: "Rejected getAllUsers call",
    GET_ALL_POSTS: "Rejected getAllPosts call",
};

const totalPosts = [
    { _id: 1, content: "First post!" },
    { _id: 2, content: "Sewcond post!" },
];

const totalUsers = [
    { _id: 1, fullName: "John Doe" },
    { _id: 2, fullName: "Willam Dafoe" },
];

const usePostServicesMock = {
    getAllPosts: vi.fn(),
    isLoading: false,
    abortAll: vi.fn(),
};

const useUserServices = {
    getAllUsers: vi.fn(),
    isLoading: false,
    abortAll: vi.fn(),
};

const setAlert = vi.fn();

function setup(options = {
    getAllPostsSuccess: true,
    getAllUsersSuccess: true,
    getAllPostsIsLoading: false,
    getAllUsersIsLoading: false,
}) {
    options.getAllPostsSuccess ?
        usePostServicesMock.getAllPosts.mockResolvedValue(totalPosts) :
        usePostServicesMock.getAllPosts.mockRejectedValue(new Error(ERR_MSG.GET_ALL_POSTS));

    options.getAllUsersSuccess ?
        useUserServices.getAllUsers.mockResolvedValue(totalUsers) :
        useUserServices.getAllUsers.mockRejectedValue(new Error(ERR_MSG.GET_ALL_USERS));

    usePostServicesMock.isLoading = options.getAllPostsIsLoading;
    useUserServices.isLoading = options.getAllUsersIsLoading;

    render(
        <AlertContext.Provider value={{ setAlert }}>
            <CatalogPage />
        </AlertContext.Provider>
    );
};

describe("CatalogPage component", () => {
    it("renders users and posts catalogs", async () => {
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

    it("posts get updated on change", async () => {
        const user = userEvent.setup();
        setup();

        const postsCatalog = await screen.findByTestId("posts-catalog");

        await user.click(postsCatalog);
        expect(await screen.findAllByTestId("post")).toHaveLength(UPDATED_POSTS_AMOUNT);
    });

    it.each([
        { name: "does not render users  while data is loading", isLoading: true },
        { name: "renders users on after data has loaded", isLoading: false },
    ])("$name", ({ isLoading }) => {
        setup({
            getAllPostsSuccess: true,
            getAllUsersSuccess: true,
            getAllPostsIsLoading: false,
            getAllUsersIsLoading: isLoading,
        });

        if (isLoading) {
            expect(screen.queryByTestId("users-catalog")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("users-catalog")).toBeInTheDocument();
        };
    });

    it.each([
        { name: "does not render posts while data is loading", isLoading: true },
        { name: "renders posts after data has loaded", isLoading: false },
    ])("$name", ({ isLoading }) => {
        setup({
            getAllPostsSuccess: true,
            getAllUsersSuccess: true,
            getAllPostsIsLoading: isLoading,
            getAllUsersIsLoading: false,
        });

        if (isLoading) {
            expect(screen.queryByTestId("posts-catalog")).not.toBeInTheDocument();
        } else {
            expect(screen.getByTestId("posts-catalog")).toBeInTheDocument();
        };
    });

    it.each([
        { name: "shows alert message on a failed posts data fetch", getAllPostsSuccess: false, getAllUsersSuccess: true },
        { name: "shows alert message on a failed users data fetch", getAllPostsSuccess: true, getAllUsersSuccess: false },
    ])("$name", async ({ getAllPostsSuccess, getAllUsersSuccess }) => {
        setup({
            getAllPostsIsLoading: false,
            getAllPostsSuccess,
            getAllUsersIsLoading: false,
            getAllUsersSuccess,
        });

        await waitFor(() => {
            if (!getAllPostsSuccess) {
                expect(setAlert).toHaveBeenCalledWith(ERR_MSG.GET_ALL_POSTS);
            };

            if (!getAllUsersSuccess) {
                expect(setAlert).toHaveBeenCalledWith(ERR_MSG.GET_ALL_USERS);
            };
        });
    });
});