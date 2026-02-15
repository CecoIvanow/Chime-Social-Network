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

describe("ProfilePage component", () => {
    function renderComp(
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
            useUserServicesMock.getUserPosts.mockRejectedValue(new Error(""));

        const { unmount } = render(
            <AlertContext.Provider value={{ setAlert }}>
                <ProfilePage />
            </AlertContext.Provider>
        );

        return unmount;
    }

    it.each([
        { isLoading: false, renderedComp: "ProfileSection" },
        { isLoading: true, renderedComp: "isLoading" },
    ])("passes props and on isLoading $isLoading renders $renderedComp", async ({ isLoading }) => {
        const pattern = new RegExp(`^${userData.firstName}$`)

        renderComp({
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
            })
            expect(screen.queryByTestId("profile-loading-spinner")).not.toBeInTheDocument();
        };
    });

    it.each([
        { isLoading: false, renderedComp: "PostsSection" },
        { isLoading: true, renderedComp: "isLoading" },
    ])("passes props and on isLoading $isLoading renders $renderedComp", async ({ isLoading }) => {
        const pattern = new RegExp(`^${userData.firstName}$`)

        renderComp({
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
                expect(screen.getAllByTestId("post")).toHaveLength(userPosts.createdPosts.length);
            });
            expect(screen.queryByTestId("posts-loading-spinner")).not.toBeInTheDocument();
        };
    });

    it.each([
        { getUserData: false, renderedComp: "ProfileSection" },
        { getUserPosts: false, renderedComp: "ProfileSection" },
    ])("triggers setAlert on rejected $renderedComp", async ({ getUserData, getUserPosts }) => {
        renderComp({
            isLoading: false,
            getUserData,
            getUserPosts,
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalled();
        })
    });

    it("triggers abortAll on unmount", () => {
        const unmount = renderComp();

        unmount();

        expect(useUserServicesMock.abortAll).toHaveBeenCalled();
    });
});