import { useContext } from "react";

import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../contexts/alert-context";
import { TotalPostsContext } from "../../../contexts/total-posts-context";

import ProfilePage from "./ProfilePage";

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({
        ...useUserServicesMock
    })
}));

vi.mock("../../shared/profile/profile-section/ProfileSection", () => ({
    default: ({ isLoading, userData }) => <>
        {isLoading ? (
            <div data-testid="profile-loading-spinner"></div>
        ) : (
            <div data-testid="profile-section">{userData.firstName}</div>
        )};
    </>
}));

vi.mock("../../shared/post/posts-section/PostsSection", () => ({
    default: function PostsSection({ isLoading, userName }) {
        const context = useContext(TotalPostsContext);

        return (
            <>
                {isLoading ? (
                    <div data-testid="posts-loading-spinner" ></div>
                ) : (
                    <>
                        <div data-testid="posts-section">{userName}</div>
                        {context.totalPosts.map(post =>
                            <div key={post._id} data-testid="post"></div>)}
                    </>)
                }
            </>
        )
    }
}));

const ERR_MSG = {
    GET_USER_DATA: "Rejected getUserData call!",
    GET_POST_DATA: "Rejected getUserPosts call!",
};

const useUserServicesMock = {
    getUserData: vi.fn(),
    getUserPosts: vi.fn(),
    abortAll: vi.fn(),
    isLoading: false,
};

const userData = { firstName: "Petar" };

const userPosts = {
    createdPosts: [
        { _id: 2 },
        { _id: 1 },
    ]
};

const setAlert = vi.fn();

function setup(
    options = {
        isLoading: true,
        getUserData: true,
        getUserPosts: true,
    }
) {
    useUserServicesMock.isLoading = options.isLoading;

    useUserServicesMock.getUserData = options.getUserData ?
        useUserServicesMock.getUserData.mockResolvedValue(userData) :
        useUserServicesMock.getUserData.mockRejectedValue(new Error(ERR_MSG.GET_USER_DATA));

    useUserServicesMock.getUserPosts = options.getUserPosts ?
        useUserServicesMock.getUserPosts.mockResolvedValue(userPosts) :
        useUserServicesMock.getUserPosts.mockRejectedValue(new Error(ERR_MSG.GET_POST_DATA));

    return render(
        <AlertContext.Provider value={{ setAlert }}>
            <ProfilePage />
        </AlertContext.Provider>
    );
};

describe("ProfilePage component", () => {
    it.each([
        { name: "renders a loading spinner while the user data is being fetched", isLoading: true },
        { name: "renders the user data after it has been fetched", isLoading: false },
    ])("$name", async ({ isLoading }) => {
        const pattern = new RegExp(`^${userData.firstName}$`)

        setup({
            isLoading,
            getUserData: true,
            getUserPosts: true,
        });

        if (isLoading) {
            expect(screen.queryByTestId("profile-section")).not.toBeInTheDocument();
            expect(screen.getByTestId("profile-loading-spinner")).toBeInTheDocument();
        } else {
            await waitFor(() => {
                expect(screen.getByTestId("profile-section")).toHaveTextContent(pattern);
            });

            expect(screen.queryByTestId("profile-loading-spinner")).not.toBeInTheDocument();
        };
    });

    it.each([
        { name: "renders a loading spinner while the post data is being fetched", isLoading: true },
        { name: "renders the post data after it has been fetched", isLoading: false },
    ])("$name", async ({ isLoading }) => {
        const pattern = new RegExp(`^${userData.firstName}$`)

        setup({
            isLoading,
            getUserData: true,
            getUserPosts: true,
        });

        if (isLoading) {
            expect(screen.queryByTestId("posts-section")).not.toBeInTheDocument();
            expect(screen.getByTestId("posts-loading-spinner")).toBeInTheDocument();
        } else {
            await waitFor(() => {
                expect(screen.getByTestId("posts-section")).toHaveTextContent(pattern);
            });

            expect(screen.getAllByTestId("post")).toHaveLength(userPosts.createdPosts.length);
            expect(screen.queryByTestId("posts-loading-spinner")).not.toBeInTheDocument();
        };
    });

    it("shows error message on rejected user data call", async () => {
        setup({
            isLoading: false,
            getUserData: false,
            getUserPosts: true,
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.GET_USER_DATA);
        });
    });

    it("shows error message on rejected user posts call", async () => {
        setup({
            isLoading: false,
            getUserData: true,
            getUserPosts: false,
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(ERR_MSG.GET_POST_DATA);
        });
    });

    it("stops all ongoing calls on unmount", () => {
        const { unmount } = setup();

        unmount();
        expect(useUserServicesMock.abortAll).toHaveBeenCalled();
    });
});